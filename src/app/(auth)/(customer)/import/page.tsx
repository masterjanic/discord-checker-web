import { Suspense } from "react";

import Box from "~/app/_components/common/box";
import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import TokenInput from "~/app/_components/customer/token-input";
import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";
import { FREE_ACCOUNTS_LIMIT } from "~/consts/discord";
import { isUserSubscribed } from "~/lib/auth";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export const metadata = {
  title: "Token Import | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function Page() {
  const session = await getServerAuthSession();

  const totalAccounts = await db.discordAccount.count({
    where: {
      ownerId: session?.user?.id,
    },
  });
  const limitReached = totalAccounts >= FREE_ACCOUNTS_LIMIT;
  const remaining = Math.max(0, FREE_ACCOUNTS_LIMIT - totalAccounts);

  return (
    <>
      <div className="mb-4 leading-[15px]">
        <h1 className="text-xl font-bold">Token Import</h1>
        <span className="text-base text-neutral-300">
          You can import{" "}
          {isUserSubscribed(session?.user)
            ? "as many tokens as you wish"
            : `up to ${FREE_ACCOUNTS_LIMIT} accounts`}
          . The checked tokens will be added to your account.
        </span>
      </div>

      {isUserSubscribed(session?.user) || !limitReached ? (
        <Suspense fallback={<SkeletonDefault className="!h-[649px]" />}>
          <TokenInput
            remaining={!isUserSubscribed(session?.user) ? remaining : null}
          />
        </Suspense>
      ) : (
        <Box className="!p-2">
          <SubscriptionRequiredCard
            message={
              <>
                You have reached the limit of {FREE_ACCOUNTS_LIMIT} free Discord
                accounts in your account. <br />
                Please upgrade your subscription to import more tokens or delete
                some of your existing accounts.
              </>
            }
          />
        </Box>
      )}
    </>
  );
}
