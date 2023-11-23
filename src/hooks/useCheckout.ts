"use client";

import { api } from "~/trpc/react";

export default function useCheckout() {
  const { mutateAsync: createCheckout, isLoading: isCreatingCheckout } =
    api.sellix.createCheckout.useMutation();

  return {
    createCheckout,
    isCreatingCheckout,
  };
}
