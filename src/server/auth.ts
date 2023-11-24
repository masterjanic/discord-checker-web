import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Role } from "@prisma/client";
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

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/dashboard",
    error: "/",
  },
  callbacks: {
    signIn({ account }) {
      return !!account && account.provider === "discord";
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
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
