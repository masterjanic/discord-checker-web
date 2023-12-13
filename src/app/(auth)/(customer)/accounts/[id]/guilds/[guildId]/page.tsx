import { redirect } from "next/navigation";
import { Suspense } from "react";

import TitledBox from "~/app/_components/common/box-with-title";
import GuildChannels from "~/app/(auth)/(customer)/accounts/[id]/guilds/[guildId]/_components/guild-channels";
import GuildGeneralInformation from "~/app/(auth)/(customer)/accounts/[id]/guilds/[guildId]/_components/guild-general-information";
import { isValidSnowflake } from "~/lib/discord-utils";

export const metadata = {
  title: "Server Details | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page({
  params,
}: {
  params: { id: string; guildId: string };
}) {
  const { id, guildId } = params;
  if (!isValidSnowflake(id) || !isValidSnowflake(guildId)) {
    redirect("/accounts");
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <TitledBox
        title="General Information"
        className="col-span-full overflow-hidden md:col-span-6"
      >
        <Suspense>
          <GuildGeneralInformation userId={id} guildId={guildId} />
        </Suspense>
      </TitledBox>

      <TitledBox
        title="Channels"
        className="col-span-full overflow-hidden md:col-span-6"
      >
        <Suspense>
          <GuildChannels userId={id} guildId={guildId} />
        </Suspense>
      </TitledBox>
    </div>
  );
}
