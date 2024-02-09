import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";

import {
  noAccountEmbed,
  noSubscriptionEmbed,
} from "~/app/api/discord-webhook/common/responses";
import { type ICommand } from "~/app/api/discord-webhook/interfaces/interaction";
import { isUserSubscribed } from "~/lib/auth";
import { getOptionByName, styledEmbed } from "~/lib/discord-utils";
import TokenExporter from "~/lib/token-exporter";
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
        role: true,
        subscribedTill: true,
        discordAccounts: {
          select: {
            tokens: {
              select: {
                value: true,
              },
            },
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

    if (!isUserSubscribed(user)) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          embeds: [noSubscriptionEmbed.toJSON()],
          flags: MessageFlags.Ephemeral,
        },
      };
    }

    if (user.discordAccounts.length === 0) {
      const noAccountsEmbed = styledEmbed({
        title: ":x: No Accounts",
        description: "You don't have any accounts that could be exported.",
        color: 0xff0000,
      });

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          embeds: [noAccountsEmbed.toJSON()],
          flags: MessageFlags.Ephemeral,
        },
      };
    }

    const options = interaction.data.options;
    const fileType =
      (getOptionByName<string>("file-type", options) as string) ?? "txt";

    const exporter = new TokenExporter(user.discordAccounts);

    let file: Blob | null = null;
    if (fileType === "txt") {
      const content = exporter.toPlain();
      file = new Blob([content], { type: "text/plain" });
    }

    if (fileType === "json") {
      const content = exporter.toJSON();
      file = new Blob([content], { type: "application/json" });
    }

    if (fileType === "csv") {
      const content = exporter.toCSV();
      file = new Blob([content], { type: "text/csv" });
    }

    const payloadJson = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        attachments: [
          {
            id: "0",
            filename: `tokens.${fileType}`,
            description: "Tokens exported from DTC-Web.",
          },
        ],
      },
    };

    const data = new FormData();
    data.append("payload_json", JSON.stringify(payloadJson));
    data.append("file[0]", file!, `tokens.${fileType}`);

    return new Response(data, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  },
};
