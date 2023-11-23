import clsx from "clsx";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AiFillHourglass } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";
import Box from "~/app/_components/common/box";
import { btnStyle } from "~/app/_components/common/button";
import { stripe } from "~/server/stripe/client";

export const metadata = {
  title: "Thank you! | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

interface ICheckoutCompletePageProps {
  searchParams: {
    payment_intent: string;
    payment_intent_client_secret: string;
    redirect_status: string;
  };
}

export default async function Page({
  searchParams,
}: ICheckoutCompletePageProps) {
  const { payment_intent } = searchParams;

  try {
    const { status } = await stripe.paymentIntents.retrieve(payment_intent);
    return (
      <Box className="text-center">
        {status === "succeeded" && (
          <>
            <span className="text-2xl font-bold">
              <FiCheck className="mx-auto" />
            </span>
            <h1 className="mt-2 text-xl font-medium">Payment Successfull</h1>
            <p className="mt-2 text-base text-neutral-200">
              Your payment has been processed successfully. <br />
              Thank you for your purchase!
            </p>
          </>
        )}

        {status === "processing" && (
          <>
            <span className="text-2xl font-bold">
              <AiFillHourglass className="mx-auto" />
            </span>
            <h1 className="mt-2 text-xl font-medium">Payment Processing</h1>
            <p className="mt-2 text-base text-neutral-200">
              Your payment is currently being processed. <br />
              Thank you for your purchase!
            </p>
          </>
        )}

        {[
          "canceled",
          "requires_payment_method",
          "requires_confirmation",
          "requires_capture",
          "requires_action",
        ].includes(status) && (
          <>
            <span className="text-2xl font-bold">
              <FiX className="mx-auto" />
            </span>
            <h1 className="mt-2 text-xl font-medium">Payment Error</h1>
            <p className="mt-2 text-base text-neutral-200">
              Your payment has failed or was canceled. <br />
              Please contact support if you need help.
            </p>
          </>
        )}

        <Link href="/dashboard" className={clsx(btnStyle, "mt-6")}>
          Back to Dashboard
        </Link>
      </Box>
    );
  } catch (err) {
    redirect("/dashboard");
  }
}
