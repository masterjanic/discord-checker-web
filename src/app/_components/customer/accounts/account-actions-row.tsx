"use client";

import { FiLogIn } from "react-icons/fi";
import Button from "~/app/_components/common/button";
import { api } from "~/trpc/react";

interface IAccountActionsRowProps {
  userId: string;
}

export default function AccountActionsRow({ userId }: IAccountActionsRowProps) {
  const [account] = api.account.get.useSuspenseQuery(userId);

  return (
    <div>
      <div>
        <input name="token" type="hidden" value={account.tokens[0]!.value} />
        <Button name="fast-login">
          <FiLogIn className="h-4 w-4" />
          <span>Fast Login</span>
        </Button>
      </div>
    </div>
  );
}
