"use client";

import { api } from "~/trpc/react";

export default function GuildChannels(props: {
  userId: string;
  guildId: string;
}) {
  const [channels] = api.account.guild.getChannels.useSuspenseQuery(props);

  return (
    <>
      <pre>{JSON.stringify(channels, null, 2)}</pre>
    </>
  );
}
