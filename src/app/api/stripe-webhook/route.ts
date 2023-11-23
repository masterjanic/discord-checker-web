import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { stripe } from "~/server/stripe/client";
import { handlePaymentIntentSucceeded } from "~/server/stripe/stripe-webhook-handlers";

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

const handler = async (req: NextRequest) => {
  try {
    const body = await req.text();

    const signature = headers().get("stripe-signature");
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret,
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded({ event });
        break;
      default:
        break;
    }

    await db.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
        object: event.object,
        api_version: event.api_version,
        account: event.account,
        created: new Date(event.created * 1000),
        data: {
          object: event.data.object as Stripe.Event.Data.Object,
          previous_attributes: event.data.previous_attributes,
        },
        livemode: event.livemode,
        pending_webhooks: event.pending_webhooks,
        request: {
          id: event.request?.id,
          idempotency_key: event.request?.idempotency_key,
        },
      },
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }
};

export { handler as POST };
