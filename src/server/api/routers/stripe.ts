import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe/stripe-webhook-handlers";

export const stripeRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session } = ctx;
    const customerId = await getOrCreateStripeCustomerIdForUser({
      userId: session.user.id,
    });
    if (!customerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid customer.",
      });
    }

    const { client_secret } = await stripe.paymentIntents.create({
      customer: customerId,
      amount: 500,
      currency: "usd",
      description: "DTC-WEB | 1 month subscription",
      metadata: {
        userId: session.user.id,
      },
    });

    return {
      clientSecret: client_secret,
    };
  }),
});
