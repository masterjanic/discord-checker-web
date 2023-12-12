import { Role } from "@prisma/client";
import { InteractionResponseType } from "discord-api-types/v10";

import { type ICommand } from "~/app/api/discord-webhook/interfaces/interaction";
import { styledEmbed } from "~/lib/discord-utils";
import { db } from "~/server/db";

export const command: ICommand = {
  execute: async ({ ping }) => {
    const userCount = await db.user.count({
      where: {
        role: {
          not: Role.ADMIN,
        },
      },
    });
    const accountCount = await db.discordAccount.count();
    const subscriptionCount = await db.user.count({
      where: {
        subscribedTill: {
          gte: new Date(),
        },
      },
    });

    const embed = styledEmbed({
      title: "System Status",
      description: "All systems are operational.",
      fields: [
        {
          name: "Ping",
          value: `${ping.toFixed(2)}ms`,
        },
        {
          name: "Total stored Discord accounts",
          value: accountCount.toString(),
        },
        {
          name: "Registered Users",
          value: userCount.toString(),
          inline: true,
        },
        {
          name: "Subscribed Users",
          value: subscriptionCount.toString(),
          inline: true,
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
