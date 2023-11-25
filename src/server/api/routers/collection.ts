import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getOwnerId } from "~/lib/auth";
import { isValidSnowflake } from "~/lib/discord-utils";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const collectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    const { session, db } = ctx;
    return db.discordAccountCollection.findMany({
      where: {
        ownerId: session.user.id,
      },
    });
  }),
  getWithCursor: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.db.discordAccountCollection.findMany({
        where: {
          ownerId: getOwnerId(ctx.session.user),
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          accounts: {
            orderBy: {
              id: "asc",
              rating: "desc",
            },
            take: 6,
            select: {
              id: true,
              username: true,
              discriminator: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              accounts: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
  get: protectedProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    const { session, db } = ctx;
    return db.discordAccountCollection.findUnique({
      where: {
        id: input,
        ownerId: session.user.id,
      },
    });
  }),
  create: protectedProcedure.mutation(({ ctx }) => {
    const { session, db } = ctx;
    return db.discordAccountCollection.create({
      data: {
        name: "Unnamed Collection",
        ownerId: session.user.id,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().max(32).optional(),
        accounts: z.array(z.string().refine(isValidSnowflake)).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { id, name, accounts } = input;

      const collection = await db.discordAccountCollection.findUnique({
        where: {
          id,
          ownerId: session.user.id,
        },
        select: {
          accounts: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!collection) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return db.discordAccountCollection.update({
        where: {
          id,
          ownerId: session.user.id,
        },
        data: {
          name,
          accounts: accounts
            ? {
                disconnect: collection.accounts,
                connect: accounts.map((id) => ({ id })),
              }
            : undefined,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      const { session, db } = ctx;
      return db.discordAccountCollection.delete({
        where: {
          id: input,
          ownerId: session.user.id,
        },
      });
    }),
});
