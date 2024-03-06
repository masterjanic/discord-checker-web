import { Role } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const leaderboardRouter = createTRPCRouter({
  getRanking: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const users = await db.user.findMany({
      take: 10,
      orderBy: {
        discordAccounts: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        subscribedTill: true,
        role: true,
        createdAt: true,
        publicAnonymous: true,
        publicProfile: true,
        _count: {
          select: {
            discordAccounts: true,
          },
        },
      },
    });
    for (const user of users) {
      if (user.publicAnonymous) {
        user.name = "Anonymous User";
        user.image = null;
      }
    }

    while (users.length < 10) {
      users.push({
        id: Math.random().toString(36).substring(7),
        name: "Available Slot",
        image: null,
        subscribedTill: null,
        role: Role.CUSTOMER,
        createdAt: new Date(),
        publicAnonymous: false,
        publicProfile: false,
        _count: {
          discordAccounts: 0,
        },
      });
    }

    return users;
  }),
  getAccountDistribution: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const topUsers = await db.user.findMany({
      take: 10,
      orderBy: {
        discordAccounts: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        name: true,
        publicAnonymous: true,
        _count: {
          select: {
            discordAccounts: true,
          },
        },
      },
    });
    const otherCount = await db.discordAccount.count({
      where: {
        ownerId: {
          notIn: topUsers.map((user) => user.id),
        },
      },
    });

    return [
      ...topUsers.map((user) => ({
        name: user.publicAnonymous ? "Anonymous User" : `@${user.name}`,
        count: user._count.discordAccounts,
      })),
      {
        name: "Everyone Else",
        count: otherCount,
      },
    ];
  }),
});
