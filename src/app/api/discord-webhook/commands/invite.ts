import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, InteractionResponseType } from "discord-api-types/v10";

import { type ICommand } from "~/app/api/discord-webhook/interfaces/interaction";
import { env } from "~/env";
import { styledEmbed } from "~/lib/discord-utils";

export const command: ICommand = {
  execute: () => {
    const embed = styledEmbed({
      title: "Invite Link",
      description:
        "If you want to invite this bot to your server, click the button below.",
    });

    const inviteButton = new ButtonBuilder({
      style: ButtonStyle.Link,
      url: `https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&scope=applications.commands`,
      label: "Click to invite",
    });

    const row = new ActionRowBuilder<ButtonBuilder>({
      components: [inviteButton.toJSON()],
    });

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [embed.toJSON()],
        components: [row.toJSON()],
      },
    };
  },
};
