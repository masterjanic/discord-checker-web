"use client";

import { api } from "~/trpc/react";

export default function GuildGeneralInformation(props: {
  userId: string;
  guildId: string;
}) {
  const [guild] = api.account.guild.get.useSuspenseQuery(props);

  return (
    <>
      <pre>{JSON.stringify(guild, null, 2)}</pre>
    </>
  );
}
