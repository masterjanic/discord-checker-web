"use client";

import { useRouter } from "next/navigation";
import {
  PiArrowsClockwiseDuotone,
  PiDotsThreeBold,
  PiSignInDuotone,
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
import { canLogin, isMigratedUser } from "~/lib/discord-utils";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function AccountHeader({ userId }: { userId: string }) {
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

  return (
    <div className="flex items-center justify-between gap-4 mt-2">
      <div className="flex items-center space-x-4">
        <DiscordAvatar user={account} />
        <div>
          <div className="mb-1.5">
            {isMigratedUser(account.discriminator) ? (
              <h1 className="text-2xl font-medium">@{account.username}</h1>
            ) : (
              <h1 className="text-2xl font-medium">
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
          onClick={() => recheck(userId)}
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
                Export
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => deleteAccount(userId)}
            >
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
