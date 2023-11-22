import { accountRouter } from "~/server/api/routers/account";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  account: accountRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
