"use client";

import Link from "next/link";
import {
  PiCheckCircleDuotone,
  PiWarningCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

import AccountRating from "~/app/_components/common/discord/account-rating";
import TitledCard from "~/components/common/titled-card";
import {
  formatPhoneNumber,
  snowflakeToMilliseconds,
} from "~/lib/discord-utils";
import { getRelativeTime } from "~/lib/time";
import { api } from "~/trpc/react";

export default function AccountInformationCard({ userId }: { userId: string }) {
  const [account] = api.account.get.useSuspenseQuery(userId);

  const values = [
    {
      name: "ID",
      value: account.id,
    },
    {
      name: "Global Name",
      value: account.global_name ?? "-",
    },
    {
      name: "Verified",
      value: account.verified ? (
        <PiCheckCircleDuotone className="text-green-500" />
      ) : (
        <PiXCircleDuotone className="text-red-500" />
      ),
    },
    {
      name: "Email",
      value: account.email ? (
        <Link href={`mailto:${account.email}`}>{account.email}</Link>
      ) : (
        "-"
      ),
    },
    {
      name: "Phone",
      value: account.phone ? (
        <Link href={`tel:${account.phone}`}>
          {formatPhoneNumber(account.phone)}
        </Link>
      ) : (
        "-"
      ),
    },
    {
      name: "MFA",
      value: account.mfa_enabled ? (
        <PiCheckCircleDuotone className="text-green-500" />
      ) : (
        <PiWarningCircleDuotone className="text-yellow-500" />
      ),
    },
    {
      name: "Locale",
      value: account.locale ?? "en-US",
    },
    {
      name: "Account Creation",
      value: getRelativeTime(new Date(snowflakeToMilliseconds(account.id))),
    },
  ];

  return (
    <TitledCard
      title="User Information"
      extra={<AccountRating user={account} />}
    >
      {values.map(({ name, value }) => (
        <div
          key={`account-info-${userId}-${name}`}
          className="flex items-center justify-between space-y-1 border-b last:border-b-0 py-2 first:pt-0 last:pb-0 px-1"
        >
          <span className="font-medium">{name}</span>
          <span>{value}</span>
        </div>
      ))}
    </TitledCard>
  );
}
