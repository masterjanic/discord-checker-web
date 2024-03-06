"use client";

import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import TitledCard from "~/components/common/titled-card";

export default function AccountServersSubscriptionPlaceholder() {
  return (
    <TitledCard title="Account Servers">
      <SubscriptionRequiredCard feature="the account server list" />
    </TitledCard>
  );
}
