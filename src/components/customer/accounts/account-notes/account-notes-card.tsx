"use client";

import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";

import TitledCard from "~/components/common/titled-card";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

export default function AccountNotesCard({ userId }: { userId: string }) {
  const utils = api.useUtils();

  const [account] = api.account.get.useSuspenseQuery(userId);
  const [notes, setNotes] = useState<string>(account.notes ?? "");

  const { mutateAsync: updateAccount } = api.account.update.useMutation({
    onMutate: async (input) => {
      await utils.account.get.cancel();

      setNotes(input.notes ?? "");
      return {
        prevData: account,
      };
    },
    onError: (error, input, ctx) => {
      utils.account.get.setData(input.id, ctx!.prevData);
      setNotes(ctx!.prevData?.notes ?? "");
    },
    onSettled: async () => {
      await utils.account.get.invalidate();
    },
  });

  const debouncedUpdateAccount = useCallback(
    debounce((notes: string) => {
      void updateAccount({
        id: userId,
        notes,
      });
    }, 500),
    [userId, updateAccount],
  );

  useEffect(() => {
    return () => {
      debouncedUpdateAccount.cancel();
    };
  }, [debouncedUpdateAccount]);

  return (
    <TitledCard title="Personal Notes">
      <div className="flex flex-col space-y-2">
        <Textarea
          rows={5}
          maxLength={1024}
          placeholder="Your notes about this account..."
          value={notes}
          onChange={({ target }) => {
            setNotes(target.value);
            debouncedUpdateAccount(target.value);
          }}
        />

        <small className="font-light ml-1.5">
          {notes.length}/1024 characters
        </small>
      </div>
    </TitledCard>
  );
}
