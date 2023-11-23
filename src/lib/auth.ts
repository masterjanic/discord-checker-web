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
