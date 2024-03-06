import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

/**
 * This router relates to the Developer Settings section in the user profile settings.
 */
export const userDeveloperRouter = createTRPCRouter({
  getKeys: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    return db.apiKey.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  createKey: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(32),
        allowedIps: z.array(z.string().ip()).min(1).max(10),
        expiresAt: z.date().refine((date) => date.getTime() > Date.now()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const keyCount = await db.apiKey.count({
        where: {
          userId: session.user.id,
        },
      });
      if (keyCount >= 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only have 5 API keys.",
        });
      }

      return db.apiKey.create({
        data: {
          ...input,
          userId: session.user.id,
          value: crypto.randomUUID(),
        },
      });
    }),
  updateKey: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(32),
        allowedIps: z.array(z.string().ip()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      return db.apiKey.update({
        where: {
          id: input.id,
          userId: session.user.id,
        },
        data: input,
      });
    }),
  deleteKey: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      return db.apiKey.delete({
        where: {
          id: input,
          userId: session.user.id,
        },
      });
    }),
});
