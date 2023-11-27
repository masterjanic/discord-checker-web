"use client";

import { useRouter } from "next/navigation";
import { FiLogIn, FiRefreshCw, FiTrash } from "react-icons/fi";

import Button from "~/app/_components/common/button";
import { canLogin } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

interface IAccountActionsRowProps {
  userId: string;
}

export default function AccountActionsRow({ userId }: IAccountActionsRowProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const [account] = api.account.get.useSuspenseQuery(userId);

  const { mutateAsync: deleteAccount, isLoading: isDeleting } =
    api.account.delete.useMutation({
      onSuccess: () => {
        router.push("/accounts");
      },
    });
  const { mutateAsync: recheck, isLoading: isRechecking } =
    api.account.recheck.useMutation({
      onSuccess: async () => {
        await utils.account.get.invalidate(userId);
      },
    });

  const disabled = !canLogin(account.flags);

  return (
    <div className="flex space-x-2">
      <div>
        {/** TODO: Remove the line below once the chrome extension v1 becomes outdated, replaced by data-fast-login attribute **/}
        <input name="token" type="hidden" value={account.tokens[0]!.value} />
        <Button
          name="fast-login"
          disabled={disabled}
          data-fast-login={!disabled ? account.tokens[0]!.value : undefined}
        >
          <FiLogIn className="h-4 w-4" />
          <span>{!disabled ? "Fast Login" : "Account Disabled"}</span>
        </Button>
      </div>
      <div>
        <Button
          onClick={() => recheck(userId)}
          disabled={isRechecking || isDeleting}
          className="!border-yellow-600 !bg-yellow-700 hover:!bg-yellow-800"
        >
          <FiRefreshCw className="h-4 w-4" />
          <span>Recheck</span>
        </Button>
      </div>
      <div>
        <Button
          onClick={() => deleteAccount(userId)}
          disabled={isRechecking || isDeleting}
          className="!border-red-600 !bg-red-700 hover:!bg-red-800"
        >
          <FiTrash className="h-4 w-4" />
          <span>Delete Account</span>
        </Button>
      </div>
    </div>
  );
}
