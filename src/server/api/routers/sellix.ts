import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createPayment } from "~/server/sellix/client";

export const sellixRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;

    const { data: payment } = await createPayment({
      title: "1 month subscription | DTC-Web",
      value: 4.99,
      quantity: 1,
      white_label: false,
      return_url: "https://discord-checker.janic.dev/dashboard",
      currency: "USD",
      email: session.user.email!,
      custom_fields: {
        userId: session.user.id,
      },
    });

    return {
      url: payment.data.url,
    };
  }),
});
