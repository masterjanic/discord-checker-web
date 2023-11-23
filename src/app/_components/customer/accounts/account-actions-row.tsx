"use client";

import { useRouter } from "next/navigation";
import { FiLogIn, FiTrash } from "react-icons/fi";
import Button from "~/app/_components/common/button";
import { canLogin } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

interface IAccountActionsRowProps {
  userId: string;
}

export default function AccountActionsRow({ userId }: IAccountActionsRowProps) {
  const router = useRouter();

  const [account] = api.account.get.useSuspenseQuery(userId);

  const { mutateAsync: deleteAccount } = api.account.delete.useMutation({
    onSuccess: () => {
      router.push("/accounts");
    },
  });

  const disabled = !canLogin(account.flags);

  return (
    <div className="flex space-x-2">
      <div>
        <input name="token" type="hidden" value={account.tokens[0]!.value} />
        <Button name="fast-login" disabled={disabled}>
          <FiLogIn className="h-4 w-4" />
          <span>{!disabled ? "Fast Login" : "Account Disabled"}</span>
        </Button>
      </div>
      <div>
        <Button
          onClick={() => deleteAccount(userId)}
          className="!border-red-600 !bg-red-700 hover:!bg-red-800"
        >
          <FiTrash className="h-4 w-4" />
          <span>Delete Account</span>
        </Button>
      </div>
    </div>
  );
}
