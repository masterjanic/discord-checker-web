import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "~/env";
import { db } from "~/server/db";
import {
  handlePaymentSucceeded,
  type ISellixWebhookEvent,
} from "~/server/sellix/sellix-webhook-handlers";

const webhookSecret = env.SELLIX_WEBHOOK_SECRET;

const handler = async (req: NextRequest) => {
  try {
    const body = await req.text();

    const headerSignature = req.headers.get("X-Sellix-Signature")!;
    const signature = crypto
      .createHmac("sha512", webhookSecret)
      .update(body)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "hex");
    const headerSignatureBuffer = Buffer.from(headerSignature, "hex");

    if (headerSignatureBuffer.length !== signatureBuffer.length) {
      throw new Error("Signatures length mismatch");
    }

    if (!crypto.timingSafeEqual(signatureBuffer, headerSignatureBuffer)) {
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
