import { eq, type SQL } from "drizzle-orm";
import { type PgColumn } from "drizzle-orm/pg-core";
import { type Session } from "next-auth";

import { UserRole } from "~/server/db/schema";

/**
 * Returns a query condition based on the user's role.
 * This is used to distinguish between regular users and administrators for protected queries and
 * mutations.
 *
 * @param user The user to check the role of.
 * @param column The column to compare the user's ID to.
 */
export const conditionalQuery = (
  user: Pick<Session["user"], "id" | "role">,
  column: PgColumn,
): SQL | undefined => {
  const isAdmin = isAdministrator(user);
  return isAdmin ? undefined : eq(column, user.id);
};

/**
 * A shorthand function to check if a user is subscribed.
 * If the user is an administrator, they are considered subscribed.
 *
 * @param user The user to check the subscription status of.
 */
export const isUserSubscribed = (
  user?: Pick<Session["user"], "subscribedTill" | "role">,
): boolean => {
  if (!user) {
    return false;
  }

  if (isAdministrator(user)) {
    return true;
  }

  return !!user.subscribedTill && new Date() < new Date(user.subscribedTill);
};

/**
 * A shorthand function to check if a user is an administrator.
 *
 * @param user The user to check the role of.
 */
export const isAdministrator = (
  user?: Pick<Session["user"], "role">,
): boolean => {
  return user?.role === UserRole.ADMIN;
};
