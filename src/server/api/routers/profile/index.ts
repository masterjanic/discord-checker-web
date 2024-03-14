import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { isAdministrator } from "~/lib/auth";
import { profileDashboardRouter } from "~/server/api/routers/profile/dashboard";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { createPayment } from "~/server/sellix/client";
import { profileApiKeysRouter } from "./api-keys";

/**
 * This router refers to all profile-related procedures.
 * It is used to perform tasks related to the user's profile of the current session.
 */
export const profileRouter = createTRPCRouter({
  apiKeys: profileApiKeysRouter,
  dashboard: profileDashboardRouter,
  /**
   * Retrieves the current user's profile.
   */
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
  /**
   * Update your own profile.
   */
  update: protectedProcedure
    .input(
      createInsertSchema(users)
        .pick({
          id: true,
          publicProfile: true,
          publicAnonymous: true,
        })
        .partial({
          publicProfile: true,
          publicAnonymous: true,
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId, ...data } = input;

      const updatedProfile = await db
        .update(users)
        .set(data)
        .where(eq(users.id, session.user.id))
        .returning()
        .then((res) => res[0]);
      if (!updatedProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested user could not be found.",
        });
      }

      return updatedProfile;
    }),
  /**
   * Delete your own profile.
   */
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const { db, session } = ctx;

    if (isAdministrator(session.user)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Administrators cannot delete their own account.",
      });
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, session.user.id))
      .returning()
      .then((res) => res[0]);
    if (!deletedUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Failed to delete your account. Maybe it was already deleted?",
      });
    }

    return deletedUser;
  }),
  /**
   * This procedure creates a new checkout session for the user to purchase a subscription.
   */
  subscribe: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;
    if (isAdministrator(session.user)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Administrators cannot purchase a subscription.",
      });
    }

    try {
      // TODO: Move return url to env variable or use AUTH_URL to get the current url
      const { data: payment } = await createPayment({
        title: "1 month subscription | DTC-Web",
        value: 4.99,
        quantity: 1,
        white_label: false,
        return_url: "https://discord-checker.janic.dev/dashboard",
        currency: "USD",
        // Since we only allow sign in with email, we can assume the email is always present.
        email: session.user.email!,
        custom_fields: {
          // Link the internal user id to the payment to verify the payment later
          userId: session.user.id,
        },
      });
      return payment.data.url;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while creating the payment session.",
      });
    }
  }),
});
