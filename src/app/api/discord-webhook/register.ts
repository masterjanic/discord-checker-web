import "dotenv/config";

import { REST } from "@discordjs/rest";
import {
  ApplicationCommandOptionType,
  Routes,
  type APIApplicationCommand,
} from "discord-api-types/v10";

const APPLICATION_ID = process.env.AUTH_DISCORD_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

const commands = [
  {
    name: "status",
    description: "Shows the status of DTC-Web and its services.",
  },
  {
    name: "invite",
    description: "Shows the invite link for DTC-Web.",
  },
  {
    name: "accounts",
    description: "Actions related to your Discord accounts.",
    options: [
      {
        name: "import",
        description: "Imports new Discord tokens to your account.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "legacy-tokens",
            description: "Whether to support legacy token format.",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
          },
          {
            name: "exclude-duplicates",
            description:
              "Whether to exclude duplicate accounts (tokens with same ID).",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
          },
        ],
      },
      {
        name: "export",
        description: "Exports your Discord tokens.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "file-type",
            description: "The file type of the exported tokens.",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
              {
                name: "Text",
                value: "txt",
              },
              {
                name: "HTML",
                value: "html",
              },
              {
                name: "JSON",
                value: "json",
              },
              {
                name: "CSV",
                value: "csv",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "profile",
    description: "Shows information about your DTC-Web profile.",
  },
  {
    name: "login-script",
    description: "Shows a script to log in with a Discord token.",
    options: [
      {
        name: "token",
        description: "The Discord token to use.",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
] as APIApplicationCommand[];

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

async function main() {
  await rest.put(Routes.applicationCommands(APPLICATION_ID), {
    body: commands,
  });
}

main()
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
