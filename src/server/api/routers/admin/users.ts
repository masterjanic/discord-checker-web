import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, ne, or } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { accounts, UserRole, users } from "~/server/db/schema";

export const adminUsersRouter = createTRPCRouter({
  /**
   * Retrieves all users with all details.
   */
  getAll: adminProcedure.query(({ ctx }) => {
    const { db } = ctx;
    return db.query.users.findMany();
  }),
  /**
   * Retrieves paginated users with relevant details.
   */
  getWithCursor: adminProcedure
    .input(
      z.object({
        cursor: z.number().int().positive().nullish(),
        filters: z
          .object({
            search: z.string().optional(),
            limit: z.number().min(1).max(100).nullish(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const cursor = input.cursor ?? 0;

      const filters = input.filters ?? {};
      const limit = filters.limit ?? 50;

      const searchFilter = filters.search
        ? or(
            // Exact match on the internal user id
            eq(users.id, filters.search),
            // Exact match on the user's email address
            eq(users.email, filters.search),
            // The user's name contains the search string
            ilike(users.name, `%${filters.search}%`),
          )
        : undefined;

      const items = await db.query.users.findMany({
        // TODO: Implement more filters
        where: and(
          searchFilter,
          // Exclude ourselves
          ne(users.id, session.user.id),
        ),
        columns: {
          id: true,
          name: true,
          image: true,
          subscribedTill: true,
          role: true,
          createdAt: true,
        },
        limit: limit + 1,
        offset: cursor,
        // TODO: Implement custom ordering
        // Show the most recently created users first.
        orderBy: desc(users.createdAt),
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        items.pop();
        nextCursor = cursor + limit;
      }

      return {
        items,
        nextCursor,
      };
    }),
  /**
   * Retrieves a single user with all details by their id.
   */
  get: adminProcedure
    .input(z.string().cuid2())
    .query(async ({ ctx, input: userId }) => {
      const { db } = ctx;
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
          // Include the user's linked OAuth accounts
          accounts: {
            columns: {
              providerAccountId: true,
              provider: true,
            },
            orderBy: desc(accounts.expires_at),
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested user could not be found.",
        });
      }

      return user;
    }),
  /**
   * Updates the details of a specific user by their id and returns the updated user.
   */
  update: adminProcedure
    .input(
      createInsertSchema(users, {
        id: (schema) => schema.id.cuid2(),
        email: (schema) => schema.email.email(),
        image: (schema) => schema.image.url(),
      })
        .pick({
          id: true,
          name: true,
          email: true,
          image: true,
          subscribedTill: true,
          role: true,
          publicProfile: true,
          publicAnonymous: true,
        })
        .partial({
          name: true,
          email: true,
          image: true,
          subscribedTill: true,
          role: true,
          publicProfile: true,
          publicAnonymous: true,
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { id: userId, ...data } = input;
      if (userId === session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot update yourself since you are an administrator.",
        });
      }

      const updatedUser = await db
        .update(users)
        .set(data)
        .where(eq(users.id, userId))
        .returning()
        .then((res) => res[0]);
      if (!updatedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested user could not be found.",
        });
      }

      return updatedUser;
    }),
  /**
   * Delete a single user by their id and return the deleted user.
   */
  delete: adminProcedure
    .input(z.string().cuid2())
    .mutation(async ({ ctx, input: userId }) => {
      const { db, session } = ctx;

      if (userId === session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete yourself since you are an administrator.",
        });
      }

      const deletedUser = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning()
        .then((res) => res[0]);
      if (!deletedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested user could not be found.",
        });
      }

      return deletedUser;
    }),
  /**
   * Deletes all users from the database, except for administrators.
   */
  deleteAll: adminProcedure.mutation(({ ctx }) => {
    const { db } = ctx;
    return db.delete(users).where(ne(users.role, UserRole.ADMIN));
  }),
});
