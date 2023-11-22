"use client";

import clsx from "clsx";
import { FiLogIn } from "react-icons/fi";
import Button from "~/app/_components/common/button";
import { canLogin } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

interface IAccountActionsRowProps {
  userId: string;
}

export default function AccountActionsRow({ userId }: IAccountActionsRowProps) {
  const [account] = api.account.get.useSuspenseQuery(userId);

  const disabled = !canLogin(account.flags);

  return (
    <div>
      <div>
        <input name="token" type="hidden" value={account.tokens[0]!.value} />
        <Button
          name="fast-login"
          className={clsx(
            disabled && "!border-red-600 !bg-red-700 hover:!bg-red-800",
          )}
          disabled={disabled}
        >
          <FiLogIn className="h-4 w-4" />
          <span>{!disabled ? "Fast Login" : "Account Disabled"}</span>
        </Button>
      </div>
    </div>
  );
}
