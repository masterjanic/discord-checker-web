import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";

import { noAccountEmbed } from "~/app/api/discord-webhook/common/responses";
import { type ICommand } from "~/app/api/discord-webhook/interfaces/interaction";
import {
  discordAvatarURL,
  dynamicTimestamp,
  styledEmbed,
  usernameOrTag,
} from "~/lib/discord-utils";
import { db } from "~/server/db";

export const command: ICommand = {
  execute: async ({ interaction }) => {
    const executor = interaction.member?.user ?? interaction.user!;
    const user = await db.user.findFirst({
      where: {
        accounts: {
          some: {
            providerAccountId: executor.id,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        subscribedTill: true,
        _count: {
          select: {
            discordAccounts: true,
          },
        },
      },
    });
    if (!user) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          embeds: [noAccountEmbed.toJSON()],
          flags: MessageFlags.Ephemeral,
        },
      };
    }

    const avatarUrl = discordAvatarURL(executor, { size: 128 });
    const embed = styledEmbed({
      title: "Your Profile",
      author: {
        name: usernameOrTag(interaction.member?.user ?? interaction.user!),
        icon_url: avatarUrl,
      },
      thumbnail: {
        url: avatarUrl,
      },
      fields: [
        {
          name: "Internal Account ID",
          value: user.id.toString(),
        },
        {
          name: "Account Created At",
          value: dynamicTimestamp(user.createdAt.getTime(), "R"),
          inline: true,
        },
        {
          name: "Subscribed Till",
          value: user.subscribedTill
            ? dynamicTimestamp(user.subscribedTill.getTime(), "R")
            : "N/A",
          inline: true,
        },
        {
          name: "Total Discord Accounts",
          value: user._count.discordAccounts.toString(),
        },
      ],
    });

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [embed.toJSON()],
      },
    };
  },
};
