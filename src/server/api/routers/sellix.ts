import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createPayment } from "~/server/sellix/client";

export const sellixRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;

    const { data: payment } = await createPayment({
      title: "DTC-WEB | 1 month subscription",
      value: 5,
      quantity: 1,
      white_label: false,
      return_url: "https://discord-checker-janic.dev/dashboard",
      currency: "USD",
      gateways: ["BITCOIN"],
      email: session.user.email!,
    });

    return {
      url: payment.data.url,
    };
  }),
});
