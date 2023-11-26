import { Role } from "@prisma/client";
import clsx from "clsx";
import { type User } from "next-auth";
import { FaCrown } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

import UserAvatar from "~/app/_components/admin/user-avatar";
import Box from "~/app/_components/common/box";
import Tooltip from "~/app/_components/common/tooltip";
import { isUserSubscribed } from "~/lib/auth";

interface IUserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "id" | "name" | "image" | "role"> & {
    subscribedTill?: Date | null;
  };
}

export default function UserCard({
  user,
  className,
  ...props
}: IUserCardProps) {
  return (
    <Box
      className={clsx(
        "relative !px-3 !py-4 text-center transition duration-200 hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      <div className="flex items-center">
        <UserAvatar user={user} />
        <div className="ml-4 text-left">
          <div className="flex items-center space-x-2 truncate text-sm">
            <span className="font-medium">{user.name}</span>
            <div className="flex items-center space-x-1">
              {user.role !== Role.ADMIN &&
                isUserSubscribed(user as unknown as User) && (
                  <Tooltip
                    text={`Subscribed till ${new Date(
                      user.subscribedTill!,
                    ).toLocaleDateString("en-US")}`}
                  >
                    <FiStar className="w-4 h-4 text-yellow-400" />
                  </Tooltip>
                )}

              {user.role === Role.ADMIN && (
                <Tooltip text="Admin">
                  <FaCrown className="w-4 h-4 text-yellow-400" />
                </Tooltip>
              )}
            </div>
          </div>
          <small className="text-xs text-neutral-300">{user.id}</small>
        </div>
      </div>
    </Box>
  );
}
