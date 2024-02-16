import { db } from "~/server/db";

export interface SellixWebhookEvent {
  event: string;
  data: {
    customer_email: string;
    custom_fields: {
      userId: string;
    };
  };
}

export const handlePaymentSucceeded = async (event: SellixWebhookEvent) => {
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const { userId } = event.data.custom_fields;
  await db.user.update({
    where: { id: userId },
    data: { subscribedTill: oneMonthFromNow },
  });
};
