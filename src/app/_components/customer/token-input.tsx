"use client";

import { useRef } from "react";
import { FiFilePlus, FiRefreshCcw } from "react-icons/fi";
import AlertMessage from "~/app/_components/common/alert-message";
import Button from "~/app/_components/common/button";
import CheckerSettings from "~/app/_components/customer/checker-settings";
import useChecker from "~/hooks/useChecker";
import useImporter from "~/hooks/useImporter";
import { getTokenMatchesForString } from "~/lib/discord-utils";

export default function TokenInput() {
  const {
    replaceTokens,
    importFromFile,
    settings,
    tokens,
    setSetting,
    removeToken,
  } = useImporter();
  const { checkTokens, isChecking, setIsChecking, cancel, accounts } =
    useChecker();

  const fileUpload = useRef<HTMLInputElement>(null);

  return (
    <>
      {!isChecking && (
        <>
          <div>
            <input
              type="file"
              accept="text/*"
              onClick={(e) => (e.currentTarget.value = "")}
              onChange={importFromFile}
              ref={fileUpload}
              className="hidden"
              multiple={true}
            />
            <Button
              onClick={() => fileUpload.current && fileUpload.current.click()}
              aria-label="Import tokens from file"
            >
              <FiFilePlus className="h-5 w-5" />
            </Button>
          </div>

          <textarea
            className="mt-4 w-full resize-none rounded-md border border-blurple bg-blueish-grey-700/50 p-2 font-mono font-light leading-tight text-neutral-200 caret-blurple outline-none backdrop-blur transition duration-300 scrollbar-thin focus:border-blurple-dark"
            spellCheck={false}
            placeholder="Paste your tokens here, one per line."
            rows={15}
            value={tokens.join("\n")}
            onChange={(e) =>
              replaceTokens(getTokenMatchesForString(e.target.value))
            }
          />

          <div className="mt-2 flex items-center justify-between">
            <Button
              disabled={tokens.length === 0}
              onClick={() => {
                setIsChecking(true);
                checkTokens(tokens, removeToken).catch(console.error);
              }}
            >
              <FiRefreshCcw className="h-5 w-5" />
              <span>Check Tokens</span>
            </Button>

            <p className="text-sm text-neutral-200">
              <b>{tokens.length}</b> Tokens to Check
            </p>
          </div>
        </>
      )}

      {isChecking && (
        <>
          <AlertMessage
            type="error"
            message="Do not close this page while checking tokens or your progess will be lost."
            className="mt-6"
          />

          <p className="mt-4">
            Remaining Tokens: <b>{tokens.length}</b>
          </p>
        </>
      )}

      <CheckerSettings
        settings={settings}
        handleChange={(key, value) => setSetting(key, value)}
      />
    </>
  );
}
