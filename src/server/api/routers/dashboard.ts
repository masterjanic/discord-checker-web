import { Role } from "@prisma/client";
import { getOwnerId } from "~/lib/auth";
import {
  generateFlaggedAccountsQuery,
  localeToCountry,
} from "~/lib/discord-utils";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const isAdmin = user.role === Role.ADMIN;

    const ownerId = isAdmin ? undefined : user.id;
    const adminClause = `"public"."DiscordAccount"."ownerId" = '${user.id}' AND`;

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
  getCountryDistribution: protectedProcedure.query(async ({ ctx }) => {
    const localeDistribution = await ctx.db.discordAccount.groupBy({
      where: { ownerId: getOwnerId(ctx.session.user) },
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
});
