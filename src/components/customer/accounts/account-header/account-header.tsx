"use client";

import { useRouter } from "next/navigation";
import {
  PiArrowsClockwiseDuotone,
  PiDotsThreeBold,
  PiExportDuotone,
  PiSignInDuotone,
  PiTrashDuotone,
} from "react-icons/pi";

import BadgeList from "~/app/_components/common/discord/badge-list";
import DiscordAvatar from "~/app/_components/common/discord/discord-avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { canLogin, isMigratedUser, usernameOrTag } from "~/lib/discord-utils";
import { trpcToast } from "~/lib/trpc-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function AccountHeader({ userId }: { userId: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const [account] = api.account.get.useSuspenseQuery(userId);

  const { mutateAsync: deleteAccount, isLoading: isDeleting } =
    api.account.delete.useMutation({
      onSuccess: async () => {
        router.push("/accounts");

        await utils.account.get.invalidate(userId);
      },
    });
  const { mutateAsync: recheck, isLoading: isRechecking } =
    api.account.recheck.useMutation({
      onSuccess: async (data) => {
        if (data.deleted) {
          router.push("/accounts");
        }

        await utils.account.get.invalidate(userId);
      },
    });

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
      <div className="flex items-center space-x-4">
        <DiscordAvatar user={account} />
        <div>
          <div className="mb-1.5 max-w-[200px] md:max-w-[260px] xl:max-w-full">
            {isMigratedUser(account.discriminator) ? (
              <h1 className="text-2xl font-medium truncate">
                @{account.username}
              </h1>
            ) : (
              <h1 className="text-2xl font-medium truncate">
                <span>{account.username}</span>
                <small className="text-base text-neutral-300">
                  #{account.discriminator}
                </small>
              </h1>
            )}
          </div>

          <BadgeList user={account} size={16} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            trpcToast({
              promise: recheck(userId),
              config: {
                loading: "Rechecking account...",
                success: "Account rechecked",
                error: "Failed to recheck account",
                successDescription: `The account ${usernameOrTag(account)} has been rechecked.`,
                errorDescription:
                  "The account could not be rechecked. Please try again.",
              },
            })
          }
          disabled={isRechecking || isDeleting}
        >
          <PiArrowsClockwiseDuotone
            className={cn("h-4 w-4 mr-2", isRechecking && "animate-spin")}
          />
          <span>Recheck</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          data-fast-login={account.tokens[0]!.value}
          disabled={!canLogin(account.flags) || isRechecking || isDeleting}
        >
          <PiSignInDuotone className="h-4 w-4 mr-2" />
          <span>Fast Login</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={isRechecking || isDeleting}
            >
              <PiDotsThreeBold className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              // TODO
            }
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-not-allowed disabled:opacity-50"
                disabled
              >
                <PiExportDuotone className="h-4 w-4 mr-1.5" />
                <span>Export</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                trpcToast({
                  promise: deleteAccount(userId),
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
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
