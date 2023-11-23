import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import {
  handlePaymentSucceeded,
  type ISellixWebhookEvent,
} from "~/server/sellix/sellix-webhook-handlers";
import crypto from "crypto";

const webhookSecret = env.SELLIX_WEBHOOK_SECRET;

const handler = async (req: NextRequest) => {
  try {
    const body = await req.text();

    const headerSignature = headers().get("x-sellix-unescaped-signature")!;
    const signature = crypto
      .createHmac("sha512", webhookSecret)
      .update(body)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(headerSignature, "utf-8"),
      )
    ) {
      throw new Error("Webhook signature verification failed");
    }

    const eventData = JSON.parse(body) as ISellixWebhookEvent;

    switch (eventData.event) {
      case "order:paid":
        await handlePaymentSucceeded(eventData);
        break;
      default:
        break;
    }

    await db.sellixEvent.create({ data: eventData });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }
};

export { handler as POST };
