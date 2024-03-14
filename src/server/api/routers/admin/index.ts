import { sql } from "drizzle-orm";

import { adminUsersRouter } from "~/server/api/routers/admin/users";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

/**
 * This router refers to all admin-related procedures. It is used to perform administrative tasks which are only
 * available to users with the `ADMIN` role.
 */
export const adminRouter = createTRPCRouter({
  /**
   * This procedure implements a panic button that wipes the entire database.
   *
   * Why would you ever need this? Well...
   */
  panic: adminProcedure.mutation(({ ctx }) => {
    // TODO: Test if this works
    const { db } = ctx;
    return db.execute(sql`DROP SCHEMA public CASCADE;`);
  }),
  /**
   * This sub-router implements a user management system to administrate users.
   */
  users: adminUsersRouter,
});
