import { InteractionResponseType } from "discord-api-types/v10";

import {
  type ICommandOptions,
  type TCommandResponse,
} from "~/app/api/discord-webhook/interfaces/interaction";
import { snowflakeToMilliseconds, styledEmbed } from "~/lib/discord-utils";

const execute = ({ interaction }: ICommandOptions): TCommandResponse => {
  const ping = Date.now() - snowflakeToMilliseconds(interaction.id);

  const embed = styledEmbed({
    title: "System Status",
    description: "All systems are operational.",
    fields: [
      {
        name: "Ping",
        value: `${ping.toFixed(2)}ms`,
      },
    ],
  });

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed.toJSON()],
    },
  };
};

export { execute };
