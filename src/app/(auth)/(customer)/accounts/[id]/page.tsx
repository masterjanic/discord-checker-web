import { notFound } from "next/navigation";
import { Suspense } from "react";

import AccountHeader from "~/components/customer/accounts/account-header/account-header";
import SkeletonAccountHeader from "~/components/customer/accounts/account-header/skeleton-account-header";
import AccountHistoryCard from "~/components/customer/accounts/account-history/account-history-card";
import AccountHistorySubscriptionPlaceholder from "~/components/customer/accounts/account-history/account-history-subscription-placeholder";
import SkeletonAccountHistoryCard from "~/components/customer/accounts/account-history/skeleton-account-history-card";
import AccountInformationCard from "~/components/customer/accounts/account-information/account-information-card";
import SkeletonAccountInformationCard from "~/components/customer/accounts/account-information/skeleton-account-information-card";
import AccountNotesCard from "~/components/customer/accounts/account-notes/account-notes-card";
import SkeletonAccountNotesCard from "~/components/customer/accounts/account-notes/skeleton-account-notes-card";
import AccountPaymentMethodsCard from "~/components/customer/accounts/account-payment-methods/account-payment-methods-card";
import AccountPaymentMethodsSubscriptionPlaceholder from "~/components/customer/accounts/account-payment-methods/account-payment-methods-subscription-placeholder";
import SkeletonAccountPaymentMethodsCard from "~/components/customer/accounts/account-payment-methods/skeleton-account-payment-methods-card";
import AccountServersCard from "~/components/customer/accounts/account-servers/account-servers-card";
import AccountServersSubscriptionPlaceholder from "~/components/customer/accounts/account-servers/account-servers-subscription-placeholder";
import SkeletonAccountServersCard from "~/components/customer/accounts/account-servers/skeleton-account-servers-card";
import AccountTokensCard from "~/components/customer/accounts/account-tokens/account-tokens-card";
import SkeletonAccountTokensCard from "~/components/customer/accounts/account-tokens/skeleton-account-tokens-card";
import RequiredSubscriptionWrapper from "~/components/customer/required-subscription-wrapper";
import { Separator } from "~/components/ui/separator";
import { usernameOrTag } from "~/lib/discord-utils";
import { generateMetadata as _generateMetadata } from "~/lib/metadata";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const account = await db.discordAccount.findUnique({
    where: {
      id: params.id,
    },
    select: {
      username: true,
      discriminator: true,
    },
  });
  if (!account) {
    notFound();
  }

  return _generateMetadata({
    title: usernameOrTag(account),
    url: `/accounts/${params.id}`,
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();

  return (
    <>
      <Suspense fallback={<SkeletonAccountHeader />}>
        <AccountHeader userId={id} />
      </Suspense>
      <Separator className="my-6" />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-full overflow-hidden md:col-span-6">
          <Suspense fallback={<SkeletonAccountInformationCard />}>
            <AccountInformationCard userId={id} />
          </Suspense>
        </div>

        <div className="col-span-full overflow-hidden md:col-span-6">
          <RequiredSubscriptionWrapper
            session={session}
            placeholder={<AccountServersSubscriptionPlaceholder />}
          >
            <Suspense fallback={<SkeletonAccountServersCard />}>
              <AccountServersCard userId={id} />
            </Suspense>
          </RequiredSubscriptionWrapper>
        </div>

        <div className="col-span-full overflow-hidden md:col-span-6">
          <Suspense fallback={<SkeletonAccountTokensCard />}>
            <AccountTokensCard userId={id} />
          </Suspense>
        </div>

        <div className="col-span-full overflow-hidden md:col-span-6">
          <RequiredSubscriptionWrapper
            session={session}
            placeholder={<AccountPaymentMethodsSubscriptionPlaceholder />}
          >
            <Suspense fallback={<SkeletonAccountPaymentMethodsCard />}>
              <AccountPaymentMethodsCard userId={id} />
            </Suspense>
          </RequiredSubscriptionWrapper>
        </div>

        <div className="col-span-full overflow-hidden md:col-span-6">
          <RequiredSubscriptionWrapper
            session={session}
            placeholder={<AccountHistorySubscriptionPlaceholder />}
          >
            <Suspense fallback={<SkeletonAccountHistoryCard />}>
              <AccountHistoryCard userId={id} />
            </Suspense>
          </RequiredSubscriptionWrapper>
        </div>

        <div className="col-span-full overflow-hidden md:col-span-6">
          <Suspense fallback={<SkeletonAccountNotesCard />}>
            <AccountNotesCard userId={id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
