import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
  delete: adminProcedure
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

      if (user.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can not delete your own account.",
        });
      }

      return ctx.db.user.delete({
        where: {
          id,
        },
      });
    }),
});
