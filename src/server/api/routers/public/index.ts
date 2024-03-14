import { publicStatsRouter } from "~/server/api/routers/public/stats";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This router refers to all public procedures. They can be accessed without authentication.
 */
export const publicRouter = createTRPCRouter({
  stats: publicStatsRouter,
  // TODO: Public Profiles
  // profiles: undefined,
});
