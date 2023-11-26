"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillWarning, AiOutlineUsergroupDelete } from "react-icons/ai";
import { BiTimer } from "react-icons/bi";
import { TiUserDelete } from "react-icons/ti";

import Button from "~/app/_components/common/button";
import { api } from "~/trpc/react";

export default function ProfileDangerArea() {
  const router = useRouter();

  const { mutateAsync: deleteAccount, isLoading: isDeletingAccount } =
    api.user.delete.useMutation({
      onSuccess: () => {
        router.push("/");
      },
    });

  const {
    mutateAsync: clearDiscordAccounts,
    isLoading: isClearingDiscordAccounts,
  } = api.account.deleteAll.useMutation({
    onSuccess: () => {
      router.push("/accounts");
    },
  });

  const [isSectionEnabled, setSectionEnabled] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSectionEnabled(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      setSectionEnabled(false);
    };
  }, []);

  return (
    <>
      <div className="space-y-2 grid place-items-center border-2 px-2 py-4 border-red-600 rounded-md border-dashed">
        <AiFillWarning className="w-8 h-8 text-red-600" />
        <p className="text-red-600 text-center font-medium">
          Please be careful with the following actions. <br />
          They cannot be undone.
        </p>
      </div>

      <hr className="my-6 border-neutral-100/10" />

      <div className="space-y-8">
        <div className="space-y-4">
          <Button
            className="!bg-yellow-700 hover:!bg-yellow-800 !border-yellow-600"
            disabled={!isSectionEnabled || isClearingDiscordAccounts}
            onClick={() => clearDiscordAccounts()}
          >
            {!isSectionEnabled ? (
              <>
                <BiTimer className="h-4 w-4" />
                <span>Wait 5 seconds...</span>
              </>
            ) : (
              <>
                <AiOutlineUsergroupDelete className="h-4 w-4" />
                <span>Clear Discord Accounts</span>
              </>
            )}
          </Button>
          <p className="text-neutral-200 text-xs font-light">
            By clicking this button, you will delete all your stored Discord
            accounts from our database. <br />
          </p>
        </div>
        <div className="space-y-4">
          <Button
            className="!bg-red-700 hover:!bg-red-800 !border-red-600"
            disabled={!isSectionEnabled || isDeletingAccount}
            onClick={() => deleteAccount()}
          >
            {!isSectionEnabled ? (
              <>
                <BiTimer className="h-4 w-4" />
                <span>Wait 5 seconds...</span>
              </>
            ) : (
              <>
                <TiUserDelete className="h-4 w-4" />
                <span>Delete my Account</span>
              </>
            )}
          </Button>
          <p className="text-neutral-200 text-xs font-light">
            This action will immediately delete your account and all associated
            data. Every stored account of you will be deleted from our database.
            If you have an active subscription, you will lose access to it.
          </p>
        </div>
      </div>
    </>
  );
}
