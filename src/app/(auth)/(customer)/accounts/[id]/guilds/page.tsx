import { redirect } from "next/navigation";
import { Suspense } from "react";

import AccountGuildList from "~/app/(auth)/(customer)/accounts/[id]/guilds/_components/account-guild-list";
import { isValidSnowflake } from "~/lib/discord-utils";

export const metadata = {
  title: "Server Overview | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

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
