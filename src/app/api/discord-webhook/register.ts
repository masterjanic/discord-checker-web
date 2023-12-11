import "dotenv/config";

import { REST } from "@discordjs/rest";
import { Routes, type APIApplicationCommand } from "discord-api-types/v10";

const APPLICATION_ID = process.env.DISCORD_CLIENT_ID!;
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
