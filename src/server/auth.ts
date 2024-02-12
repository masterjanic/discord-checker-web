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
    signIn: "/dashboard",
    error: "/",
  },
  callbacks: {
    signIn({ account, profile }) {
      // Only allow sign in for Discord provider
      if (!account || account.provider !== "discord") {
        return false;
      }

      // Check if the user has an email address
      return !!profile?.email;
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
          where: {
            id: user.id,
          },
          data: {
            image: generateGravatar(user.email),
          },
        });
      }
    },
    async signIn({ user, profile }) {
      if (profile) {
        // Update existing user -> new profile picture, email or name
        await db.user.updateMany({
          where: {
            id: user.id,
          },
          data: {
            name: profile.name,
            email: profile.email,
            image: profile.image ?? generateGravatar(profile.email),
          },
        });
      }

      Sentry.setUser({
        id: user.id,
        email: user.email ?? undefined,
        username: user.name ?? undefined,
      });
    },
    signOut() {
      Sentry.setUser(null);
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
