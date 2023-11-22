import Image from "next/image";
import {
  type APIUser,
  ImageFormat,
  type UserAvatarFormat,
} from "discord-api-types/v10";
import { type SyntheticEvent, useState } from "react";
import { CDN_URL } from "~/consts/discord";
import { isMigratedUser } from "~/lib/discord-utils";

interface DiscordAvatarProps {
  user: {
    username: APIUser["username"];
    id: APIUser["id"];
    discriminator: APIUser["discriminator"];
    avatar?: APIUser["avatar"];
  };
  size?: number;
  format?: UserAvatarFormat;
}

export default function DiscordAvatar({
  user,
  format = ImageFormat.WebP,
  size = 64,
}: DiscordAvatarProps) {
  const [error, setError] = useState<SyntheticEvent | null>(null);

  const seed = isMigratedUser(user.discriminator)
    ? Number(BigInt(user.id) >> BigInt(22)) % 6
    : Number(user.discriminator) % 5;
  const isAnimated = user.avatar?.startsWith("a_") ?? false;
  const fallbackUrl = `${CDN_URL}/embed/avatars/${seed}.png`;
  const avatarUri = `${CDN_URL}/avatars/${user.id}`;

  return (
    <Image
      onError={setError}
      src={
        !user.avatar || error
          ? fallbackUrl
          : `${avatarUri}/${user.avatar}.${
              isAnimated ? ImageFormat.GIF : format
            }`
      }
      alt={`Avatar of ${user.username}`}
      width={size}
      height={size}
      className="select-none rounded-full border border-blueish-grey-600/80 bg-blueish-grey-600"
      draggable={false}
      loading="lazy"
    />
  );
}
