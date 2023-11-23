"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function useCheckout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { mutateAsync: createCheckout, isLoading: isCreatingCheckout } =
    api.stripe.createCheckout.useMutation();

  return {
    createCheckout,
    isCreatingCheckout,
    clientSecret,
    setClientSecret,
  };
}
