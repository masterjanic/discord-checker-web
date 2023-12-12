import { oneLineTrim, stripIndents } from "common-tags";
import { InteractionResponseType } from "discord-api-types/v10";

import { type ICommand } from "~/app/api/discord-webhook/interfaces/interaction";
import { getOptionByName, styledEmbed } from "~/lib/discord-utils";

export const command: ICommand = {
  execute: ({ interaction }) => {
    const options = interaction.data.options;
    const token = getOptionByName<string>("token", options) ?? "YOUR_TOKEN";

    const script = `\`\`\`js\n${oneLineTrim`document.body.appendChild(document.createElement \`iframe\`).
    contentWindow.localStorage.token = \`"${token}"\`,location.reload();`}\`\`\``;

    const embed = styledEmbed({
      title: "Login Script",
      description: stripIndents`
      You can use this script to log in with a Discord token:
      ${script}
      `,
    });

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [embed.toJSON()],
      },
    };
  },
};
