import { createId } from "@paralleldrive/cuid2";
import { count, desc, eq } from "drizzle-orm";
import { notInArray } from "drizzle-orm/sql/expressions/conditions";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { discordAccounts, UserRole, users } from "~/server/db/schema";

export const publicStatsRouter = createTRPCRouter({
  /**
   * Retrieves the top 10 users with the most accounts.
   */
  getLeaderboard: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const entries = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        subscribedTill: users.subscribedTill,
        role: users.role,
        createdAt: users.createdAt,
        publicAnonymous: users.publicAnonymous,
        publicProfile: users.publicProfile,
        discordAccounts: count(discordAccounts),
      })
      .from(users)
      .leftJoin(discordAccounts, eq(discordAccounts.ownerId, users.id))
      .orderBy(desc(count(discordAccounts)))
      .groupBy(users.id);

    for (const entry of entries) {
      // If the user is public anonymous, we don't want to expose their real name or image.
      if (entry.publicAnonymous) {
        entry.name = "Anonymous User";
        entry.image = null;
      }
    }

    while (entries.length < 10) {
      // If there are less than 10 entries, we fill the remaining slots with dummy data.
      entries.push({
        id: createId(),
        name: "Available Slot",
        image: null,
        subscribedTill: null,
        role: UserRole.CUSTOMER,
        createdAt: new Date(),
        publicAnonymous: false,
        publicProfile: false,
        discordAccounts: 0,
      });
    }

    return entries;
  }),
  /**
   * Retrieves the distribution of accounts across the platform.
   *
   * This includes the top 10 users with the most accounts, and the count of all other users.
   */
  getAccountDistribution: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const topUsers = await db
      .select({
        id: users.id,
        name: users.name,
        publicAnonymous: users.publicAnonymous,
        discordAccounts: count(discordAccounts),
      })
      .from(users)
      .leftJoin(discordAccounts, eq(discordAccounts.ownerId, users.id))
      .orderBy(desc(count(discordAccounts)))
      .groupBy(users.id)
      .limit(10);
    const { otherCount } = await db
      .select({
        otherCount: count(discordAccounts),
      })
      .from(discordAccounts)
      .where(
        notInArray(
          discordAccounts.ownerId,
          topUsers.map((user) => user.id),
        ),
      )
      .then((res) => res[0]!);

    return [
      ...topUsers.map((user) => ({
        name: user.publicAnonymous ? "Anonymous User" : user.name,
        count: user.discordAccounts,
      })),
      {
        name: "Everyone Else",
        count: otherCount,
      },
    ];
  }),
});
