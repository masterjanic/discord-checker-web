"use client";

import { type ApiKey } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";
import { FiClock, FiEdit, FiPlus, FiTrash } from "react-icons/fi";

import Button from "~/app/_components/common/button";
import CreateKeyModal from "~/app/(auth)/(customer)/profile/_components/create-key-modal";
import EditKeyModal from "~/app/(auth)/(customer)/profile/_components/edit-key-modal";
import { api } from "~/trpc/react";

function ApiKeyEntry({ entry: key }: { entry: ApiKey }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const utils = api.useUtils();
  const { mutateAsync: deleteKey, isLoading: isDeletingKey } =
    api.user.developer.deleteKey.useMutation({
      onSettled: async () => {
        await utils.user.developer.getKeys.invalidate();
      },
    });

  const daysRemaining = key.expiresAt
    ? Math.max(
        Math.ceil(
          (key.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
        0,
      )
    : -1;
  const isExpired = daysRemaining === 0;

  return (
    <>
      {isEditing && (
        <EditKeyModal
          keyData={key}
          open={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-semibold text-neutral-100">{key.name}</h5>
          <div className="flex items-center space-x-1">
            {!isExpired && (
              <>
                <FiClock className="h-3 w-3" />
                <span className="text-xs">
                  {daysRemaining !== -1 ? `${daysRemaining}d` : "Never"}
                </span>
              </>
            )}
            {isExpired && (
              <span className="px-1 text-xs rounded bg-red-500 border-red-400 border font-medium">
                Expired
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative truncate">
            <div
              className={clsx(
                "absolute inset-0 bg-blueish-grey-600/40 backdrop-blur rounded-lg",
                isVisible && "hidden",
                !isVisible && "cursor-pointer",
              )}
              onClick={() => setIsVisible(true)}
            />
            <span
              className={clsx(
                "truncate text-neutral-100 font-light font-mono",
                !isVisible && "select-none",
              )}
              draggable={false}
            >
              {key.value}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              className="!border-yellow-600 !bg-yellow-700 hover:!bg-yellow-800 !p-2"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${key.name} API Key`}
            >
              <FiEdit />
            </Button>
            <Button
              className="!border-red-600 !bg-red-700 hover:!bg-red-800 !p-2"
              onClick={() => deleteKey(key.id)}
              disabled={isDeletingKey}
              aria-label={`Delete ${key.name} API Key`}
            >
              <FiTrash />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DeveloperSettings() {
  const [keys] = api.user.developer.getKeys.useSuspenseQuery();

  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);

  return (
    <>
      {isCreateKeyModalOpen && (
        <CreateKeyModal
          open={isCreateKeyModalOpen}
          onClose={() => setIsCreateKeyModalOpen(false)}
        />
      )}
      <div className="space-y-2">
        {keys.map((key) => (
          <ApiKeyEntry key={key.id} entry={key} />
        ))}
      </div>

      <div>
        <Button className="mt-4" onClick={() => setIsCreateKeyModalOpen(true)}>
          <FiPlus />
          <span>New API Key</span>
        </Button>
      </div>
    </>
  );
}
