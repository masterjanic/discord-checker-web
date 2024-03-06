import {
  ImageFormat,
  type APIUser,
  type UserAvatarFormat,
} from "discord-api-types/v10";
import Image from "next/image";
import { useState, type SyntheticEvent } from "react";

import { CDN_URL } from "~/consts/discord";
import { isMigratedUser } from "~/lib/discord-utils";
import { cn } from "~/lib/utils";

interface DiscordAvatarProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Image>,
    "width" | "height" | "src" | "alt"
  > {
  user: Pick<APIUser, "username" | "id" | "discriminator" | "avatar">;
  size?: number;
  format?: UserAvatarFormat;
}

export default function DiscordAvatar({
  user,
  className,
  format = ImageFormat.WebP,
  size = 64,
  ...props
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
      className={cn(
        "select-none rounded-full bg-background border pointer-events-none",
        className,
      )}
      draggable={false}
      loading="lazy"
      {...props}
    />
  );
}
