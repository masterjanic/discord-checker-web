import crypto from "crypto";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Role } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider, {
  type SendVerificationRequestParams,
} from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import nodemailer from "nodemailer";

import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      subscribedTill?: Date;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    subscribedTill?: Date;
  }
}

async function sendVerificationRequest({
  identifier: email,
  url,
  provider: { server, from },
}: SendVerificationRequestParams) {
  const { host } = new URL(url);
  const transport = nodemailer.createTransport(server);
  await transport.sendMail({
    to: email,
    from,
    subject: `Verify your Login | DTC-Web`,
    text: text({ url, host }),
    html: html({ url, host, email }),
  });
}

// Email HTML body
function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

  // Some simple styling options
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "#346df1";
  const buttonBorderColor = "#346df1";
  const buttonTextColor = "#ffffff";

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
  return `Sign in to ${host}\n${url}\n\n`;
}

/**
 * Generate a gravatar image URL from an email address.
 * @param email The email address to generate the gravatar for.
 */
const generateGravatar = (email: string | undefined) => {
  if (!email) {
    return undefined;
  }

  email = email.trim().toLowerCase();

  const hash = crypto.createHash("sha256").update(email).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    signOut: "/auth/logout",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async signIn({ user, account, email }) {
      // Only allow sign in with email addresses
      if (!user.email) {
        return false;
      }

      // If the request is a verification request, allow it
      if (email?.verificationRequest) {
        return true;
      }

      const existingAccount = await db.account.findFirst({
        where: { providerAccountId: account!.providerAccountId },
        select: { id: true },
      });
      // If OAuth account already exists, allow it
      if (existingAccount) {
        return true;
      }

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
        select: { id: true },
      });
      // If user already exists, link the OAuth account and continue
      if (existingUser) {
        await db.account.create({
          data: {
            provider: account!.provider,
            type: account!.type,
            providerAccountId: account!.providerAccountId,
            access_token: account!.access_token,
            expires_at: account!.expires_at,
            scope: account!.scope,
            token_type: account!.token_type,
            id_token: account!.id_token,
            refresh_token: account!.refresh_token,
            user: {
              connect: { id: existingUser.id },
            },
          },
        });

        return true;
      }

      // Allow new users to sign in, create a new account
      return true;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
        subscribedTill: user.subscribedTill,
      },
    }),
  },
  session: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  // TODO: Setup Discord webhook events for personal use (profile settings)
  events: {
    createUser: async ({ user }) => {
      // If user has no image set, use gravatar
      if (!user.image && user.email) {
        await db.user.update({
          where: { id: user.id },
          data: {
            // If user has no name set, use the part before the @ in the email
            name: user.name ?? user.email.split("@")[0],
            image: generateGravatar(user.email),
          },
        });
      }
    },
    async signIn({ user, profile }) {
      if (profile) {
        // Update existing user -> new profile picture or name
        await db.user.updateMany({
          where: { id: user.id },
          data: {
            name: profile.name,
            image: profile.image ?? generateGravatar(profile.email),
          },
        });
      }

      Sentry.setUser({
        id: user.id,
        email: user.email ?? profile?.email ?? undefined,
        username: user.name ?? profile?.name ?? undefined,
      });
    },
    signOut() {
      Sentry.setUser(null);
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      maxAge: 5 * 60, // valid for 5 minutes
      sendVerificationRequest,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
