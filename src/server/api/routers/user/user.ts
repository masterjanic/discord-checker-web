import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { userDeveloperRouter } from "~/server/api/routers/user/developer";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  get: adminProcedure
    .input(z.string().cuid())
    .query(async ({ ctx, input: id }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id,
        },
        include: {
          accounts: {
            orderBy: {
              expires_at: "desc",
            },
            select: {
              providerAccountId: true,
            },
          },
          _count: {
            select: {
              discordAccounts: true,
              discordAccountCollections: true,
            },
          },
        },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
    }),
  getWithCursor: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, search } = input;

      const items = await ctx.db.user.findMany({
        where: {
          OR: [
            {
              accounts: {
                some: {
                  providerAccountId: {
                    contains: search ?? undefined,
                  },
                },
              },
            },
            {
              name: {
                contains: search ?? undefined,
              },
            },
          ],
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          image: true,
          subscribedTill: true,
          role: true,
          createdAt: true,
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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().max(32).optional(),
        email: z.string().email().optional(),
        role: z.nativeEnum(Role).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id, role, ...rest } = input;

      if (role && session.user.role !== Role.ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have no permissions to change roles.",
        });
      }

      if (role && id === session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can not change your own role.",
        });
      }

      return db.user.update({
        where: {
          id,
        },
        data: {
          role,
          ...rest,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().cuid().optional())
    .mutation(async ({ ctx, input }) => {
      const {
        session: { user },
        db,
      } = ctx;
      const id = input ?? user.id;
      if (user.role !== Role.ADMIN && user.id !== id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own account.",
        });
      }

      if (user.id === id && user.role === Role.ADMIN) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You can not delete your own account, because you are an admin.",
        });
      }

      return db.user.delete({
        where: {
          id,
        },
      });
    }),
  developer: userDeveloperRouter,
});
