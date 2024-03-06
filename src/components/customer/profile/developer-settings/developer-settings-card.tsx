"use client";

import type { ApiKey } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import {
  PiClockDuotone,
  PiEyeBold,
  PiEyeSlashBold,
  PiPencilBold,
  PiPlusCircleDuotone,
  PiTrashDuotone,
} from "react-icons/pi";

import TitledCard from "~/components/common/titled-card";
import CreateApiKeyDialog from "~/components/customer/profile/developer-settings/create-api-key-dialog";
import EditApiKeyDialog from "~/components/customer/profile/developer-settings/edit-api-key-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function DeveloperSettingsCard() {
  const [keys] = api.user.developer.getKeys.useSuspenseQuery();

  function ApiKeyEntry({ entry: key }: { entry: ApiKey }) {
    const [isVisible, setIsVisible] = useState(false);

    const utils = api.useUtils();
    const { mutateAsync: deleteKey, isPending: isDeletingKey } =
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
      <div className="space-y-1.5">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <Label htmlFor={`key-${key.id}`} className="font-medium text-sm">
            {key.name}
          </Label>
          <div>
            {isExpired ? (
              <Badge variant="destructive">Expired</Badge>
            ) : (
              <Badge>
                <PiClockDuotone className="mr-1" />
                <span>
                  {daysRemaining !== -1 ? `${daysRemaining}d` : "Never"}
                </span>
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            name={`key-${key.id}`}
            type={isVisible ? "text" : "password"}
            value={key.value}
            readOnly
          />
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsVisible((prev) => !prev)}
            >
              {!isVisible ? <PiEyeBold /> : <PiEyeSlashBold />}
            </Button>
            <EditApiKeyDialog keyData={key}>
              <Button variant="default" size="icon">
                <PiPencilBold />
              </Button>
            </EditApiKeyDialog>

            <Button
              variant="default"
              size="icon"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteKey(key.id)}
              disabled={isDeletingKey}
            >
              <PiTrashDuotone />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TitledCard title="Developer Settings" extra={<Badge>Beta</Badge>}>
      <p className="text-sm mb-4">
        Create up to 5 API keys to use the DTC-Web API for external services and
        tools. You can read more about the API{" "}
        <Link
          href="/features/api-access"
          target="_blank"
          className="text-primary hover:underline transition duration-300"
        >
          here
        </Link>
        .
      </p>

      <div className="space-y-4">
        {keys.map((key) => (
          <ApiKeyEntry key={key.id} entry={key} />
        ))}
      </div>

      <CreateApiKeyDialog>
        <Button className="mt-4" size="sm" disabled={keys.length >= 5}>
          <PiPlusCircleDuotone className="mr-1.5" />
          <span>New API Key</span>
        </Button>
      </CreateApiKeyDialog>
    </TitledCard>
  );
}
