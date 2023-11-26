import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  panic: adminProcedure.mutation(async ({ ctx }) => {
    const { db } = ctx;
    return db.$executeRaw`DROP SCHEMA public CASCADE;`;
  }),
});
