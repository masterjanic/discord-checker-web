"use client";

import { api } from "~/trpc/react";

interface IAccountTokensProps {
  userId: string;
}

export default function AccountTokens({ userId }: IAccountTokensProps) {
  const [account] = api.account.get.useSuspenseQuery(userId);

  return (
    <div className="space-y-1">
      {account.tokens.map((token, index) => (
        <div key={`${account.id}-token-${index}`}>
          <div className="mb-1 truncate rounded border border-blueish-grey-600 bg-blueish-grey-700/80 p-1 text-sm font-light">
            <span>{token.value}</span>
          </div>
          <small className="font-light text-neutral-200">
            Last Checked:{" "}
            {new Date(token.lastCheckedAt).toLocaleString("en-US")}
          </small>
        </div>
      ))}
    </div>
  );
}
