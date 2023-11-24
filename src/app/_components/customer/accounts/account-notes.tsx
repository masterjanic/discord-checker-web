"use client";

import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface IAccountServerOverviewProps {
  userId: string;
}

export default function AccountNotes({ userId }: IAccountServerOverviewProps) {
  const utils = api.useUtils();

  const [account] = api.account.get.useSuspenseQuery(userId);
  const [notes, setNotes] = useState<string>(account.notes ?? "");

  const { mutateAsync: updateAccount } = api.account.update.useMutation({
    onMutate: async () => {
      await utils.account.get.cancel();

      const prevData = account;
      return {
        prevData,
      };
    },
    onError: (error, input, ctx) => {
      utils.account.get.setData(input.id, ctx?.prevData);
      setNotes(ctx?.prevData?.notes ?? "");
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
    <>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          debouncedUpdateAccount(e.target.value);
        }}
        rows={5}
        maxLength={1024}
        placeholder="Your notes about this account..."
        className="w-full resize-none rounded-md border border-neutral-100/10 bg-blueish-grey-700 p-2 text-base font-light leading-tight text-neutral-200 caret-blurple outline-none backdrop-blur transition duration-300 scrollbar-thin focus:border-blurple-dark"
      />
      <span className="text-xs font-light text-neutral-300">
        {notes.length ?? 0} / 1024 characters
      </span>
    </>
  );
}
