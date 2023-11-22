"use client";

import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { snowflakeToMilliseconds } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

interface IAccountGeneralProps {
  userId: string;
}

export default function AccountGeneral({ userId }: IAccountGeneralProps) {
  const [account] = api.account.get.useSuspenseQuery(userId);

  const tableValues = [
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
        <FiCheckCircle className="text-green-500" />
      ) : (
        <FiXCircle className="text-red-500" />
      ),
    },
    {
      name: "Email",
      value: account.email ?? "-",
    },
    {
      name: "Phone",
      value: account.phone ?? "-",
    },
    {
      name: "MFA",
      value: account.mfa_enabled ? (
        <FiCheckCircle className="text-green-500" />
      ) : (
        <FiAlertTriangle className="text-yellow-500" />
      ),
    },
    {
      name: "Locale",
      value: account.locale ?? "en-US",
    },
    {
      name: "Account Creation",
      value: new Date(snowflakeToMilliseconds(account.id)).toLocaleString(
        "en-US",
      ),
    },
  ];

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="min-w-full table-auto">
        <tbody>
          {tableValues.map(({ name, value }, index) => (
            <tr
              className="border border-neutral-100/10 text-left"
              key={`details-${account.id}-${index}`}
            >
              <th className="border-r border-neutral-100/10 px-4 py-2.5 text-base font-medium">
                {name}
              </th>
              <td className="px-4 py-2.5 text-base font-light">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
