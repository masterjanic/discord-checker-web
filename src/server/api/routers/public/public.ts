import { z } from "zod";

import { leaderboardRouter } from "~/server/api/routers/public/leaderboard";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const publicRouter = createTRPCRouter({
  leaderboard: leaderboardRouter,
  // TODO: Public profile
  getProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: name }) => {
      const { db } = ctx;

      await db.user.findFirst({
        where: {
          name: {
            equals: name,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
          subscribedTill: true,
          createdAt: true,
        },
      });
    }),
});
