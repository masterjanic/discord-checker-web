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
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";

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
