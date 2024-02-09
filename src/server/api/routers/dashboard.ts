import { Role } from "@prisma/client";
import { z } from "zod";

import { getOwnerId } from "~/lib/auth";
import {
  generateFlaggedAccountsQuery,
  localeToCountry,
} from "~/lib/discord-utils";
import {
  activeSubscriptionProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const isAdmin = user.role === Role.ADMIN;

    const ownerId = isAdmin ? undefined : user.id;
    const adminClause = `("public"."DiscordAccount"."ownerId" = '${user.id}') AND`;

    // TODO: Simplify when prisma supports multiple counts in one query
    const [verified, unverified, nitro, flaggedQuery] =
      await ctx.db.$transaction([
        ctx.db.discordAccount.count({
          where: { verified: true, ownerId },
        }),
        ctx.db.discordAccount.count({
          where: { verified: false, ownerId },
        }),
        ctx.db.discordAccount.count({
          where: { verified: true, premium_type: { gt: 0 }, ownerId },
        }),
        // TODO: Remove unsafe query when prisma supports bitwise operations
        ctx.db.$queryRawUnsafe(
          `SELECT COUNT(*) FROM "public"."DiscordAccount" WHERE ${
            !isAdmin ? adminClause : ""
          } ${generateFlaggedAccountsQuery()};`,
        ),
      ]);

    const { count: flagged } = (flaggedQuery as { count: bigint }[])[0]!;
    return {
      verified,
      unverified,
      nitro,
      flagged,
    };
  }),
  getCountryDistribution: activeSubscriptionProcedure.query(async ({ ctx }) => {
    const localeDistribution = await ctx.db.discordAccount.groupBy({
      where: { ownerId: getOwnerId(ctx.session.user), locale: { not: null } },
      by: ["locale"],
      _count: {
        locale: true,
      },
    });
    return localeDistribution.map((entry) => ({
      id: localeToCountry(entry.locale),
      value: entry._count.locale,
    }));
  }),
  getNewAccounts: protectedProcedure
    .input(
      z.object({
        verified: z.boolean().optional(),
        nitro: z.boolean().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const { db, session } = ctx;
      return db.discordAccount.findMany({
        where: {
          ownerId: getOwnerId(session.user),
          verified: input.verified ?? undefined,
          premium_type: input.nitro ? { gt: 0 } : undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
        select: {
          id: true,
          username: true,
          discriminator: true,
          avatar: true,
          flags: true,
          premium_type: true,
          createdAt: true,
        },
      });
    }),
  // TODO: Improve this query
  getAccountsOverTime: activeSubscriptionProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const DAYS = 14;

    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - DAYS - 1);

    const countsPerDay = await db.discordAccount.groupBy({
      by: ["createdAt"],
      where: {
        ownerId: getOwnerId(session.user),
        createdAt: { gte: startDate, lte: currentDate },
      },
      _count: {
        createdAt: true,
      },
    });

    return new Array(DAYS)
      .fill(0)
      .map((_, index) => {
        const date = new Date();
        date.setDate(currentDate.getDate() - index);

        const countRecord = countsPerDay
          .filter((record) => {
            const recordDate = new Date(record.createdAt);
            return recordDate.toDateString() === date.toDateString();
          })
          .reduce((acc, record) => {
            return acc + record._count.createdAt;
          }, 0);

        return {
          date: date.toLocaleDateString("en-US"),
          count: countRecord,
        };
      })
      .reverse();
  }),
});
