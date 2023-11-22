"use client";

import { api } from "~/trpc/react";

interface IAccountBillingProps {
  userId: string;
}

export default function AccountBilling({ userId }: IAccountBillingProps) {
  const [billing] = api.account.getBilling.useSuspenseQuery(userId);

  return <></>;
}
