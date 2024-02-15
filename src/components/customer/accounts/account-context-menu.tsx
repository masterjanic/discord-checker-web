"use client";

import { type DiscordAccount } from "@prisma/client";
import Link from "next/link";
import {
  PiArrowClockwiseDuotone,
  PiCopyDuotone,
  PiExportDuotone,
  PiEyeDuotone,
  PiListDuotone,
  PiPlusCircleDuotone,
  PiSignInDuotone,
  PiTrashDuotone,
  PiUserDuotone,
} from "react-icons/pi";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { usernameOrTag } from "~/lib/discord-utils";
import { trpcToast } from "~/lib/trpc-toast";
import { api } from "~/trpc/react";

interface AccountContextMenuProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuTrigger> {
  account: Pick<DiscordAccount, "id" | "username" | "discriminator"> & {
    tokens: { value: string }[];
  };
}

export default function AccountContextMenu({
  account,
  children,
  ...props
}: AccountContextMenuProps) {
  const utils = api.useUtils();

  const { mutateAsync: recheck, isLoading: isRechecking } =
    api.account.recheck.useMutation({
      onSuccess: async () => {
        await utils.account.getWithCursor.invalidate();
      },
    });

  const { mutateAsync: deleteAccount } = api.account.delete.useMutation({
    onSettled: async () => {
      await utils.account.getWithCursor.invalidate();
    },
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger {...props}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuLabel className="truncate">
          {usernameOrTag(account)}
        </ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem asChild>
          <Link href={`/accounts/${account.id}`} className="cursor-pointer">
            <PiEyeDuotone className="w-4 h-4 mr-1.5" />
            <span>View Profile</span>
          </Link>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PiUserDuotone className="h-4 w-4 mr-1.5" />
            <span>Account Actions</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem asChild>
              <button
                className="cursor-pointer w-full"
                name="fast-login"
                data-fast-login={account.tokens[0]!.value}
              >
                <PiSignInDuotone className="h-4 w-4 mr-1.5" />
                <span>Fast Login</span>
              </button>
            </ContextMenuItem>
            <ContextMenuItem asChild>
              <button
                className="cursor-pointer w-full disabled:opacity-50"
                disabled={isRechecking}
                onClick={() => {
                  trpcToast({
                    promise: recheck(account.id),
                    config: {
                      loading: "Rechecking account...",
                      success: "Account rechecked",
                      error: "Failed to recheck account",
                      successDescription: `The account ${usernameOrTag(account)} has been rechecked.`,
                      errorDescription:
                        "The account could not be rechecked. Please try again.",
                    },
                  });
                }}
              >
                <PiArrowClockwiseDuotone className="h-4 w-4 mr-1.5" />
                <span>Recheck</span>
              </button>
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() =>
                trpcToast({
                  promise: deleteAccount(account.id),
                  config: {
                    loading: "Deleting account...",
                    success: "Account deleted",
                    error: "Failed to delete account",
                    successDescription: `The account ${usernameOrTag(account)} has been deleted.`,
                    errorDescription:
                      "The account could not be deleted. Please try again.",
                  },
                })
              }
            >
              <PiTrashDuotone className="h-4 w-4 mr-1.5" />
              <span>Delete</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PiListDuotone className="w-4 h-4 mr-1.5" />
            <span>Collections</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {
              // TODO
            }
            <ContextMenuItem asChild>
              <button
                className="w-full cursor-not-allowed disabled:opacity-50"
                disabled
              >
                <PiPlusCircleDuotone className="h-4 w-4 mr-1.5" />
                <span>Add to Collection</span>
              </button>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        {
          // TODO
        }
        <ContextMenuItem asChild>
          <button
            className="w-full cursor-not-allowed disabled:opacity-50"
            disabled
          >
            <PiExportDuotone className="h-4 w-4 mr-1.5" />
            <span>Export</span>
          </button>
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer"
          onClick={() => void navigator.clipboard.writeText(account.id)}
        >
          <PiCopyDuotone className="h-4 w-4 mr-1.5" />
          <span>Copy ID</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
