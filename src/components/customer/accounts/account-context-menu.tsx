"use client";

import { type DiscordAccount } from "@prisma/client";
import Link from "next/link";

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
import { api } from "~/trpc/react";

export default function AccountContextMenu({
  account,
  children,
  ...props
}: {
  account: Pick<DiscordAccount, "id" | "username" | "discriminator"> & {
    tokens: { value: string }[];
  };
} & React.ComponentPropsWithoutRef<typeof ContextMenuTrigger>) {
  const utils = api.useUtils();
  const { mutateAsync: deleteAccount } = api.account.delete.useMutation({
    onSettled: async () => {
      await utils.account.getWithCursor.invalidate();
    },
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger {...props}>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{usernameOrTag(account)}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem className="cursor-pointer" asChild>
          <Link href={`/accounts/${account.id}`}>View Profile</Link>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Account Actions</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem asChild>
              <button
                className="cursor-pointer w-full"
                name="fast-login"
                data-fast-login={account.tokens[0]!.value}
              >
                Fast Login
              </button>
            </ContextMenuItem>
            {
              // TODO
            }
            <ContextMenuItem asChild>
              <button
                className="cursor-not-allowed w-full disabled:opacity-50"
                disabled
              >
                Recheck
              </button>
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => deleteAccount(account.id)}
            >
              Delete
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Collections</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {
              // TODO
            }
            <ContextMenuItem asChild>
              <button
                className="w-full cursor-not-allowed disabled:opacity-50"
                disabled
              >
                Add to Collection
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
            Export
          </button>
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer"
          onClick={() => void navigator.clipboard.writeText(account.id)}
        >
          Copy ID
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
