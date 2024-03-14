import { and, asc, count, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { z } from "zod";

import { conditionalQuery } from "~/lib/auth";
import {
  generateFlaggedAccountsQuery,
  localeToCountry,
} from "~/lib/discord-utils";
import {
  activeSubscriptionProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { discordAccounts } from "~/server/db/schema";

export const profileDashboardRouter = createTRPCRouter({
  /**
   * Returns the counts of verified, unverified, nitro, and flagged accounts.
   */
  getCounts: protectedProcedure.query(({ ctx }) => {
    const { db, session } = ctx;

    return db
      .select({
        verified: sql<number>`COUNT(*)::int FILTER (WHERE ${eq(discordAccounts.verified, true)})`,
        unverified: sql<number>`COUNT(*)::int FILTER (WHERE ${eq(discordAccounts.verified, false)} OR ${isNull(discordAccounts.verified)})`,
        nitro: sql<number>`COUNT(*)::int FILTER (WHERE ${gt(discordAccounts.premium_type, 0)})`,
        flagged: sql<number>`COUNT(*)::int FILTER (WHERE ${generateFlaggedAccountsQuery(true)})`,
      })
      .from(discordAccounts)
      .where(conditionalQuery(session.user, discordAccounts.ownerId));
  }),
  /**
   * Returns the distribution of countries of the accounts.
   */
  getCountryDistribution: activeSubscriptionProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    return db
      .select({
        locale: discordAccounts.locale,
        count: count(discordAccounts),
      })
      .from(discordAccounts)
      .where(conditionalQuery(session.user, discordAccounts.ownerId))
      .groupBy(discordAccounts.locale);
  }),
  /**
   * Returns the four newest accounts of the user.
   */
  getNewAccounts: protectedProcedure
    .input(
      z.object({
        isVerified: z.boolean().optional(),
        hasNitro: z.boolean().optional(),
      }),
    )
    .query(({ ctx, input: filters }) => {
      const { db, session } = ctx;
      const { isVerified, hasNitro } = filters;

      return db.query.discordAccounts.findMany({
        where: and(
          isVerified ? eq(discordAccounts.verified, true) : undefined,
          hasNitro ? gt(discordAccounts.premium_type, 0) : undefined,
          conditionalQuery(session.user, discordAccounts.ownerId),
        ),
        limit: 4,
        orderBy: desc(discordAccounts.createdAt),
        columns: {
          id: true,
          username: true,
          discriminator: true,
          avatar: true,
          flags: true,
          premium_type: true,
          createdAt: true,
          locale: true,
        },
      });
    }),
  /**
   * Retrieves the acquired accounts over time.
   */
  getAccountsOverTime: activeSubscriptionProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const DAY_TIME_FRAME = 14;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - DAY_TIME_FRAME);

    return db
      .select({
        date: sql<string>`TO_CHAR(dtx.date, 'yyyy/mm/dd')`,
        count: sql<number>`CAST(COALESCE(${count(discordAccounts.id)}, 0) AS INTEGER)`,
      })
      .from(
        sql`(SELECT GENERATE_SERIES(${startDate}, ${new Date()}, INTERVAL '1 day') AS date) AS dtx`,
      )
      .leftJoin(
        discordAccounts,
        and(
          conditionalQuery(session.user, discordAccounts.ownerId),
          sql`TO_CHAR(${discordAccounts.createdAt}, 'yyyy/mm/dd') = TO_CHAR(dtx.date, 'yyyy/mm/dd')`,
        ),
      )
      .groupBy(sql`dtx.date`)
      .orderBy(asc(sql`dtx.date`))
      .limit(DAY_TIME_FRAME);
  }),
});
