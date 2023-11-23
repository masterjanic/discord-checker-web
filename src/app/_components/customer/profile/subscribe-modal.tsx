import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import Modal, { type IModalProps } from "~/app/_components/common/modal";
import CheckoutForm from "~/app/_components/customer/profile/checkout-form";
import { env } from "~/env.mjs";
import useCheckout from "~/hooks/useCheckout";

export default function SubscribeModal({ onClose, ...props }: IModalProps) {
  const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PK);

  const { clientSecret, createCheckout, isCreatingCheckout, setClientSecret } =
    useCheckout();

  useEffect(() => {
    if (isCreatingCheckout) return;

    createCheckout()
      .then(({ clientSecret }) => setClientSecret(clientSecret))
      .catch(console.error);
  }, []);

  return (
    <Modal className="!max-w-2xl" onClose={onClose} {...props}>
      <Modal.Head title="Subscribe for 1 month">
        You will be charged $5.00 for 1 month of subscription. This subscription
        will not renew automatically.
      </Modal.Head>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              labels: "floating",
              variables: {
                colorBackground: "#111B36",
                colorText: "#D4DDF2",
                colorTextSecondary: "#C0CDEC",
                focusOutline: "#5865F2",
                focusBoxShadow: "#5865F2",
              },
              rules: {
                ".Tab": {
                  border: "none",
                },
                ".Tab--selected": {
                  border: "none",
                  backgroundColor: "#5865F2",
                  color: "#fff",
                },
                ".TabIcon--selected": {
                  fill: "#fff",
                },
                ".Tab--selected:hover": {
                  color: "#fff",
                },
                ".Input:focus": {
                  borderColor: "#5865F2",
                },
              },
            },
            locale: "en",
          }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </Modal>
  );
}
