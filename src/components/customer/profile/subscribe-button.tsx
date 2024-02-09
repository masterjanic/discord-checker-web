"use client";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import useCheckout from "~/hooks/useCheckout";

export default function SubscribeButton() {
  const router = useRouter();
  const { createCheckout, isCreatingCheckout } = useCheckout();

  return (
    <Button
      disabled={isCreatingCheckout}
      onClick={() => {
        createCheckout()
          .then(({ url }) => router.push(url))
          .catch(console.error);
      }}
      size="sm"
    >
      Subscribe for 1 month
    </Button>
  );
}
