import { type AvatarProps } from "@radix-ui/react-avatar";
import * as Avatar from "@radix-ui/react-avatar";
import { type APIGuild } from "discord-api-types/v10";
import Image from "next/image";
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
      {guild.icon && (
        <Image
          src={src}
          className="h-full w-full flex-shrink-0 rounded-full"
          alt={guild.name}
          width={size}
          height={size}
        />
      )}
      {!guild.icon && (
        <Avatar.Fallback className="grid h-full w-full flex-shrink-0 place-items-center rounded-full bg-blueish-grey-700 font-light">
          {guild.name
            .split(" ")
            .slice(0, 2)
            .map((word) => {
              const upper = word[0]?.toUpperCase() ?? "";
              return upper.match(/[a-z0-9]/i) ? upper : "";
            })
            .join("") || "??"}
        </Avatar.Fallback>
      )}
    </Avatar.Root>
  );
}
