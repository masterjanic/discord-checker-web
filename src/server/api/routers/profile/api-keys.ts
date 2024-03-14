import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { apiKeys } from "~/server/db/schema";

// The maximum number of API keys a user can have.
const MAX_API_KEYS = 5;

/**
 * This sub-router implements a user's API key management system.
 */
export const profileApiKeysRouter = createTRPCRouter({
  /**
   * Retrieves all API keys of the current user.
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    return db.query.apiKeys.findMany({
      where: and(
        eq(apiKeys.userId, session.user.id),
        isNull(apiKeys.deletedAt),
      ),
      orderBy: desc(apiKeys.createdAt),
    });
  }),
  /**
   * Creates a new API key for the current user.
   */
  create: protectedProcedure
    .input(
      createInsertSchema(apiKeys, {
        allowedIps: z.array(z.string().ip()).min(1).max(MAX_API_KEYS),
        expiresAt: (schema) =>
          schema.expiresAt.refine((date) => date.getTime() > Date.now()),
      }).pick({
        name: true,
        allowedIps: true,
        expiresAt: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { keyCount } = await db
        .select({
          keyCount: count(apiKeys),
        })
        .from(apiKeys)
        .where(
          and(eq(apiKeys.userId, session.user.id), isNull(apiKeys.deletedAt)),
        )
        .then((res) => res[0]!);
      if (keyCount >= MAX_API_KEYS) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached the maximum of ${MAX_API_KEYS} API keys.`,
        });
      }

      const createdKey = await db
        .insert(apiKeys)
        .values({
          ...input,
          userId: session.user.id,
        })
        .returning()
        .then((res) => res[0]);
      if (!createdKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create your new API key.",
        });
      }

      return createdKey;
    }),
  /**
   * Update an existing API key of the current user.
   */
  update: protectedProcedure
    .input(
      createInsertSchema(apiKeys, {
        id: (schema) => schema.id.cuid2(),
        allowedIps: z.array(z.string().ip()).min(1).max(MAX_API_KEYS),
      })
        .pick({
          id: true,
          name: true,
          allowedIps: true,
        })
        .partial({
          name: true,
          allowedIps: true,
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: keyId, ...data } = input;

      const updatedKey = await db
        .update(apiKeys)
        .set(data)
        .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, session.user.id)))
        .returning()
        .then((res) => res[0]);
      if (!updatedKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested API key could not be found.",
        });
      }

      return updatedKey;
    }),
  /**
   * Delete an existing API key of the current user.
   */
  delete: protectedProcedure
    .input(z.string().cuid2())
    .mutation(async ({ ctx, input: keyId }) => {
      const { db, session } = ctx;
      const deletedKey = await db
        .update(apiKeys)
        .set({
          deletedAt: new Date(),
        })
        .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, session.user.id)))
        .returning()
        .then((res) => res[0]);
      if (!deletedKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested API key could not be found.",
        });
      }
      return deletedKey;
    }),
});
