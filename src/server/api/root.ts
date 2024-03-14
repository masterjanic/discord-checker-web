import { accountsRouter } from "~/server/api/routers/accounts";
import { adminRouter } from "~/server/api/routers/admin";
import { profileRouter } from "~/server/api/routers/profile";
import { publicRouter } from "~/server/api/routers/public";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  accounts: accountsRouter,
  admin: adminRouter,
  profile: profileRouter,
  public: publicRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
