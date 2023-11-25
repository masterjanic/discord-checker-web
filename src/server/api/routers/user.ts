import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
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
});
