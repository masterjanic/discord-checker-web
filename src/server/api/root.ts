import { accountRouter } from "~/server/api/routers/account/account";
import { adminRouter } from "~/server/api/routers/admin";
import { collectionRouter } from "~/server/api/routers/collection";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { publicRouter } from "~/server/api/routers/public/public";
import { sellixRouter } from "~/server/api/routers/sellix";
import { userRouter } from "~/server/api/routers/user/user";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  account: accountRouter,
  dashboard: dashboardRouter,
  sellix: sellixRouter,
  collection: collectionRouter,
  admin: adminRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
