import { type AvatarProps } from "@radix-ui/react-avatar";
import * as Avatar from "@radix-ui/react-avatar";
import { type APIGuild } from "discord-api-types/v10";
import { CDN_URL } from "~/consts/discord";

interface IGuildIconProps extends AvatarProps {
  guild: Pick<APIGuild, "name" | "id" | "icon">;
  size?: number;
}

export default function GuildIcon({ guild, size = 48 }: IGuildIconProps) {
  const isAnimated = guild.icon?.startsWith("a_") ?? false;
  const src = `${CDN_URL}/icons/${guild.id}/${guild.icon}.${
    isAnimated ? "gif" : "png"
  }?size=${size}`;

  return (
    <Avatar.Root>
      <Avatar.Image
        src={guild.icon ? src : undefined}
        className="h-full w-full flex-shrink-0 rounded-full"
        alt={guild.name}
        width={size}
        height={size}
      />
      <Avatar.Fallback className="grid h-full w-full flex-shrink-0 place-items-center rounded-full bg-blueish-grey-700 font-light">
        {guild.name
          .split(" ")
          .map((word) => word[0])
          .join("")}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
