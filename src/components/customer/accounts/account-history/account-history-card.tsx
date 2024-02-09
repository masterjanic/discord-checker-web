"use client";

import { PiArrowRightDuotone } from "react-icons/pi";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { getDifferences, type TCompareableUser } from "~/lib/discord-utils";
import { getRelativeTime } from "~/lib/time";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function AccountHistoryCard({ userId }: { userId: string }) {
  const [history] = api.account.getHistory.useSuspenseQuery(userId);

  return (
    <TitledCard
      title="Account History"
      extra={
        <HelpTooltip>Shows recent profile changes of this account</HelpTooltip>
      }
    >
      {history.length === 0 && (
        <div className="grid place-items-center h-full p-4">
          <p className="text-center font-light">
            This account has no tracked changes. <br />
            Changes will be tracked here when the account is checked for
            updates.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {history.map((entry, index) => {
          // TODO: Check types
          const after = (history[index + 1]?.data ??
            entry.discordAccount) as unknown as TCompareableUser;
          const before = entry.data as unknown as TCompareableUser;

          const differences = getDifferences(after, before);

          return (
            <Card key={`history-${entry.id}`} className="p-4 overflow-hidden">
              {differences.map((key, diffIndex) => (
                <div
                  key={`history-${entry.id}-${key}`}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-0 md:gap-4"
                >
                  <code
                    className={cn(
                      "text-primary",
                      diffIndex !== 0 && "mt-2 md:mt-0",
                    )}
                  >
                    {key}
                  </code>
                  <div className="flex items-center space-x-1">
                    <div className="max-w-[100px] lg:max-w-[160px] xl:max-w-[220px] 2xl:max-w-[260px] inline-flex">
                      <span className="text-sm font-light truncate">
                        {before[key] ?? "null"}
                      </span>
                    </div>
                    <PiArrowRightDuotone className="text-muted-foreground" />
                    <div className="max-w-[100px] lg:max-w-[160px] xl:max-w-[220px] 2xl:max-w-[260px] inline-flex">
                      <span className="text-sm font-light truncate">
                        {after[key] ?? "null"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="mt-3 mb-2" />
              <small className="font-light">
                Changed {getRelativeTime(entry.changedAt)}
              </small>
            </Card>
          );
        })}
      </div>
    </TitledCard>
  );
}
