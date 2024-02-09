"use client";

import { type DiscordToken } from "@prisma/client";
import { useState } from "react";
import { PiEyeBold, PiEyeSlashBold, PiSignInBold } from "react-icons/pi";

import TitledCard from "~/components/common/titled-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getRelativeTime } from "~/lib/time";
import { api } from "~/trpc/react";

function TokenEntry({
  token,
}: {
  token: Pick<DiscordToken, "id" | "value" | "lastCheckedAt">;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {
          // TODO: Copy on click with notification
        }
        <Input
          name={`token-${token.id}`}
          type={isVisible ? "text" : "password"}
          value={token.value}
          readOnly
        />
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {!isVisible ? <PiEyeBold /> : <PiEyeSlashBold />}
          </Button>
          <Button
            variant="default"
            size="icon"
            className="hidden md:inline-flex"
            data-fast-login={token.value}
          >
            <span className="sr-only">Fast Login with Chrome extension</span>
            <PiSignInBold />
          </Button>

          {
            // TODO: Delete Button?
          }
        </div>
      </div>
      <small className="font-light ml-1.5">
        Last checked {getRelativeTime(token.lastCheckedAt)}
      </small>
    </div>
  );
}

export default function AccountTokensCard({ userId }: { userId: string }) {
  const [{ tokens }] = api.account.get.useSuspenseQuery(userId);

  return (
    <TitledCard title="Account Tokens">
      {tokens.map((token) => (
        <TokenEntry key={`account-${userId}-token-${token.id}`} token={token} />
      ))}
    </TitledCard>
  );
}
