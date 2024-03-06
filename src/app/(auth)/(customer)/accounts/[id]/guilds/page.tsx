import { redirect } from "next/navigation";
import { Suspense } from "react";

import AccountGuildList from "~/app/(auth)/(customer)/accounts/[id]/guilds/_components/account-guild-list";
import { isValidSnowflake } from "~/lib/discord-utils";
import { generateMetadata as _generateMetadata } from "~/lib/metadata";

export function generateMetadata({ params }: { params: { id: string } }) {
  return _generateMetadata({
    title: "Server Overview",
    url: `/accounts/${params.id}/guilds`,
    robots: {
      index: false,
      follow: true,
    },
  });
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!isValidSnowflake(id)) {
    redirect("/accounts");
  }

  return (
    <>
      <Suspense>
        <AccountGuildList userId={id} />
      </Suspense>
    </>
  );
}
