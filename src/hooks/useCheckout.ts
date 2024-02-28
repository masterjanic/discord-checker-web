"use client";

import { api } from "~/trpc/react";

export default function useCheckout() {
  const { mutateAsync: createCheckout, isPending: isCreatingCheckout } =
    api.sellix.createCheckout.useMutation();

  return {
    createCheckout,
    isCreatingCheckout,
  };
}
