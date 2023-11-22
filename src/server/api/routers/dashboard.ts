import { Role } from "@prisma/client";
import { localeToCountry } from "~/lib/discord-utils";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const isAdmin = user.role === Role.ADMIN;

    const ownerId = isAdmin ? undefined : user.id;

    // TODO: Simplify when prisma supports multiple counts in one query
    const [verified, unverified, nitro] = await ctx.db.$transaction([
      ctx.db.discordAccount.count({
        where: { verified: true, ownerId },
      }),
      ctx.db.discordAccount.count({
        where: { verified: false, ownerId },
      }),
      ctx.db.discordAccount.count({
        where: { verified: true, premium_type: { gt: 0 }, ownerId },
      }),
    ]);

    return {
      verified,
      unverified,
      nitro,
    };
  }),
  getCountryDistribution: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const isAdmin = user.role === Role.ADMIN;

    const ownerId = isAdmin ? undefined : user.id;

    const localeDistribution = await ctx.db.discordAccount.groupBy({
      where: { ownerId },
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