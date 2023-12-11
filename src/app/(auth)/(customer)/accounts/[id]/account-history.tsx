"use client";

import clsx from "clsx";
import { FiArrowRight } from "react-icons/fi";

import { getDifferences, type TCompareableUser } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

export default function AccountHistory({ userId }: { userId: string }) {
  const [history] = api.account.getHistory.useSuspenseQuery(userId);

  return (
    <>
      {history.length === 0 && (
        <div className="grid place-items-center h-full p-4 text-neutral-200">
          <p>This account has no tracked changes.</p>
        </div>
      )}

      {history.map((entry, index) => {
        const after = (history[index + 1]?.data ??
          entry.discordAccount) as unknown as TCompareableUser;
        const before = entry.data as unknown as TCompareableUser;

        const differences = getDifferences(after, before);

        return (
          <div
            className={clsx(
              "cursor-pointer border-x border-t border-blueish-grey-500/20 bg-blueish-grey-700 p-2 transition duration-300 hover:bg-blueish-grey-600/80",
              index === 0 && "rounded-t",
              index === history.length - 1 && "rounded-b border-b",
            )}
            key={`account-history-${entry.id}`}
          >
            <div className="flex flex-col">
              {differences.map((key) => (
                <div
                  className="flex items-center space-x-2 text-sm py-0.5"
                  key={`account-history-${entry.id}-${key}`}
                >
                  <span>{key}:</span>
                  <span className="font-light truncate">{before[key]}</span>
                  <FiArrowRight className="text-neutral-200" />
                  <span className="font-light truncate">{after[key]}</span>
                </div>
              ))}

              <div className="mt-2 text-xs font-light text-neutral-200">
                <p>{new Date(entry.changedAt).toLocaleString("en-US")}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
