import * as Avatar from "@radix-ui/react-avatar";
import { type User } from "next-auth";
import Image from "next/image";

interface IUserAvatarProps {
  user: Pick<User, "image" | "name">;
  size?: number;
}

export default function UserAvatar({ user, size = 64 }: IUserAvatarProps) {
  return (
    <Avatar.Root>
      {user.image && (
        <Image
          src={`${user.image}?size=${size}`}
          className="h-full w-full flex-shrink-0 rounded-full"
          alt={user.name ?? "User Avatar"}
          width={size}
          height={size}
        />
      )}
      {!user.image && (
        <Avatar.Fallback className="grid h-full w-full flex-shrink-0 place-items-center rounded-full bg-blueish-grey-700 font-light">
          {user.name
            ?.split(" ")
            .slice(0, 2)
            .map((word) => {
              const upper = word[0]?.toUpperCase() ?? "";
              return upper.match(/[a-z0-9]/i) ? upper : "";
            })
            .join("") ?? "??"}
        </Avatar.Fallback>
      )}
    </Avatar.Root>
  );
}
