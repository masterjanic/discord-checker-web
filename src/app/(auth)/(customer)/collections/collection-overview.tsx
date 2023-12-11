"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { TbDots } from "react-icons/tb";

import Box from "~/app/_components/common/box";
import DiscordAvatar from "~/app/_components/common/discord/discord-avatar";
import Tooltip from "~/app/_components/common/tooltip";
import usePaginatedCollections from "~/hooks/usePaginatedCollections";
import { usernameOrTag } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

export default function CollectionOverview() {
  const { collections, page } = usePaginatedCollections({});

  const utils = api.useUtils();
  const { mutateAsync: createCollection, isLoading: isCreatingCollection } =
    api.collection.create.useMutation({
      onSuccess: async () => {
        await utils.collection.getWithCursor.invalidate();
      },
    });

  const toShow = useMemo(() => {
    return collections?.pages[page]?.items;
  }, [collections?.pages, page]);

  return (
    <div className="max-w-screen-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6">
        <Box className="!p-0 w-44 h-44 grid place-items-center">
          <Tooltip text="New Collection">
            <button
              disabled={isCreatingCollection}
              onClick={() => createCollection()}
              className="disabled:opacity-50 bg-blueish-grey-700 border border-blueish-grey-600/80 hover:bg-blueish-grey-600/80 transition duration-300 p-2 rounded"
            >
              <span className="sr-only">Create new collection</span>
              <FiPlus className="w-8 h-8" />
            </button>
          </Tooltip>
        </Box>
        {toShow?.map((collection) => {
          return (
            <Link
              href={`/collections/${collection.id}`}
              draggable={false}
              key={collection.id}
            >
              <Box className="!p-0 w-44 h-44 flex flex-col">
                <h3 className="p-2 text-sm font-normal text-neutral-100 text-center truncate shrink-0">
                  {collection.name}
                </h3>
                <div className="border-t border-neutral-100/10 flex-1 h-full overflow-auto">
                  {collection.accounts.length > 0 && (
                    <div className="grid gap-2 grid-cols-3 p-2 place-items-center h-full">
                      {collection.accounts.map((account) => (
                        <Tooltip
                          text={usernameOrTag(account)}
                          key={`${collection.id}-${account.id}`}
                        >
                          <DiscordAvatar user={account} size={32} />
                        </Tooltip>
                      ))}
                      {collection._count.accounts - collection.accounts.length >
                        0 && (
                        <Tooltip
                          text={`${
                            collection._count.accounts -
                            collection.accounts.length
                          } more`}
                        >
                          <div className="h-8 w-8 grid place-items-center bg-blueish-grey-700 border border-blueish-grey-600/80 rounded-full">
                            <TbDots />
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  )}

                  {collection.accounts.length === 0 && (
                    <div className="grid place-items-center h-full p-4 text-center">
                      <p className="text-neutral-200 text-sm font-light">
                        This collection is empty.
                      </p>
                    </div>
                  )}
                </div>
              </Box>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
