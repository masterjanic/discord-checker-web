"use client";

import { useRouter } from "next/navigation";
import pMap from "p-map";
import { useEffect } from "react";
import { toast } from "sonner";

import useTokenImport from "~/hooks/useTokenImport";
import { fetchUser } from "~/lib/discord-api";
import {
  isFlagged,
  isValidSnowflake,
  usernameOrTag,
} from "~/lib/discord-utils";
import { api } from "~/trpc/react";

export default function ImportContext() {
  const router = useRouter();

  const utils = api.useUtils();
  const { mutateAsync: createAccount } = api.account.create.useMutation({
    onSuccess: async () => {
      await utils.dashboard.invalidate();
      await utils.account.invalidate();
    },
  });
  const { running, tokens } = useTokenImport();

  useEffect(() => {
    const checkTokens = async () => {
      return pMap(
        tokens,
        async (token) => {
          const { settings, updateCount, removeTokens, pendingCancellation } =
            useTokenImport.getState();
          if (pendingCancellation) {
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, settings.delay));

          removeTokens([token]);

          const base64Id = token.split(".")[0]!;
          const decodedId = atob(base64Id);
          if (!isValidSnowflake(decodedId)) {
            updateCount("invalid");
            return;
          }

          // TODO: Check token date?

          const user = await fetchUser("@me", { token });
          if (!user) {
            updateCount("invalid");
            toast("Invalid Token", {
              description: (
                <div className="flex flex-col space-y-1">
                  <p>
                    The token for user {decodedId} was invalid and not added.
                  </p>
                </div>
              ),
              dismissible: true,
            });
            return;
          }

          // Update counts for import page
          if (user.verified) {
            updateCount("verified");
          } else {
            updateCount("unverified");
          }
          if (user.premium_type) {
            updateCount("nitro");
          }
          if (isFlagged(user.flags)) {
            updateCount("flagged");
          }

          await createAccount({
            user,
            tokens: [token],
            origin: "DTC Web",
          });

          toast("Account Imported", {
            description: (
              <div className="flex flex-col space-y-1">
                <p>{usernameOrTag(user)} has been imported.</p>
              </div>
            ),
            dismissible: true,
            action: {
              label: "View Account",
              onClick: () => {
                router.push(`/accounts/${user.id}`);
              },
            },
          });
        },
        {
          concurrency: 5,
          stopOnError: false,
        },
      );
    };

    if (running) {
      checkTokens().catch(console.error);
    }
  }, [running]);

  return <></>;
}
