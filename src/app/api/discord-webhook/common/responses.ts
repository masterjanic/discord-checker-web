import { styledEmbed } from "~/lib/discord-utils";

export const noAccountEmbed = styledEmbed({
  title: ":x: No Account",
  description:
    "You don't have an account linked to DTC-Web. Please log in first.",
  color: 0xff0000,
});
