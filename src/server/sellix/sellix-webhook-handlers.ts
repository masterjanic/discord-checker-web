import { db } from "~/server/db";

export interface ISellixWebhookEvent {
  event: string;
  data: {
    customer_email: string;
    custom_fields: {
      userId: string;
    };
  };
}

export const handlePaymentSucceeded = async (event: ISellixWebhookEvent) => {
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  await db.user.update({
    where: {
      id: event.data.custom_fields.userId,
    },
    data: {
      subscribedTill: oneMonthFromNow,
    },
  });
};
