import { db } from "~/server/db";

export interface ISellixWebhookEvent {
  event: string;
  data: {
    customer_email: string;
  };
}

export const handlePaymentSucceeded = async (event: ISellixWebhookEvent) => {
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  await db.user.update({
    where: {
      email: event.data.customer_email,
    },
    data: {
      subscribedTill: oneMonthFromNow,
    },
  });
};
