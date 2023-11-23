import type Stripe from "stripe";

import { db } from "~/server/db";
import { stripe } from "~/server/stripe/client";

interface IStripeWebhookHandler {
  event: Stripe.Event;
}

interface IGetOrCreateStripeCustomerIdForUser {
  userId: string;
}

/**
 * Retrieves a Stripe customer id for a given user if it exists or creates a new one.
 * @param userId
 */
export const getOrCreateStripeCustomerIdForUser = async ({
  userId,
}: IGetOrCreateStripeCustomerIdForUser) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    metadata: {
      userId,
    },
  });

  const updatedUser = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  if (updatedUser.stripeCustomerId) {
    return updatedUser.stripeCustomerId;
  }
};

export const handlePaymentIntentSucceeded = async ({
  event,
}: IStripeWebhookHandler) => {
  const intent = event.data.object as Stripe.PaymentIntent;
  const userId = intent.metadata.userId!;

  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      subscribedTill: oneMonthFromNow,
    },
  });
};
