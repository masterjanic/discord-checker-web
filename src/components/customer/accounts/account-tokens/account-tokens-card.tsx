"use client";

import { type DiscordToken } from "@prisma/client";
import { useState } from "react";
import {
  PiCopyDuotone,
  PiEyeBold,
  PiEyeSlashBold,
  PiSignInBold,
} from "react-icons/pi";

import TitledCard from "~/components/common/titled-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getRelativeTime } from "~/lib/time";
import { api } from "~/trpc/react";

function TokenEntry({
  token,
}: {
  token: Pick<DiscordToken, "id" | "value" | "lastCheckedAt">;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip open={isCopied}>
            <TooltipTrigger asChild>
              <Input
                name={`token-${token.id}`}
                type={isVisible ? "text" : "password"}
                value={token.value}
                className="cursor-pointer select-none"
                onClick={async () => {
                  setIsCopied(true);
                  await navigator.clipboard.writeText(token.value);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                }}
                readOnly
              />
            </TooltipTrigger>
            <TooltipContent className="flex items-center space-x-1.5">
              <PiCopyDuotone className="h-4 w-4" />
              <span>Copied to clipboard</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
      <div className="space-y-2">
        {tokens.map((token) => (
          <TokenEntry
            key={`account-${userId}-token-${token.id}`}
            token={token}
          />
        ))}
      </div>
    </TitledCard>
  );
}
