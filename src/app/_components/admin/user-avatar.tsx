import { type User } from "next-auth";
import Image from "next/image";
import { useState, type SyntheticEvent } from "react";

interface IUserAvatarProps {
  user: Pick<User, "image" | "name">;
  size?: number;
}

export default function UserAvatar({ user, size = 64 }: IUserAvatarProps) {
  const [error, setError] = useState<SyntheticEvent | null>(null);

  return (
    <Image
      onError={setError}
      src={
        !user.image || error
          ? "/images/default_user.png"
          : `${user.image}?size=${size}`
      }
      alt={user.name ?? "User Avatar"}
      width={size}
      height={size}
      className="select-none rounded-full border border-blueish-grey-600/80 bg-blueish-grey-600"
      draggable={false}
      loading="lazy"
    />
  );
}
