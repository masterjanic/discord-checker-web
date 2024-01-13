import { Role } from "@prisma/client";
import { type User } from "next-auth";

/**
 * Returns the owner id of a user based on their role.
 * @param role
 * @param id
 */
export const getOwnerId = ({ role, id }: Pick<User, "id" | "role">) => {
  const isAdmin = role === Role.ADMIN;
  return isAdmin ? undefined : id;
};

/**
 * Returns whether a user is subscribed or not.
 * @param user
 */
export const isUserSubscribed = (user: User | undefined): boolean => {
  return (
    isAdministrator(user) ||
    (!!user?.subscribedTill && new Date() < new Date(user.subscribedTill))
  );
};

/**
 * Returns whether an authed user is an administrator or not.
 * @param user
 */
export const isAdministrator = (user: User | undefined): boolean => {
  return user?.role === Role.ADMIN;
};
