import { type ChangeEvent, useState } from "react";
import { TOKEN_REGEX } from "~/consts/discord";
import {
  getTokenMatchesForString,
  removeTokenDuplicates,
} from "~/lib/discord-utils";

export interface ICheckerSettings {
  delay: number;
  includeLegacy: boolean;
  removeDuplicates: boolean;
}

export default function useImporter() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [settings, setSettings] = useState<ICheckerSettings>({
    delay: 0,
    includeLegacy: true,
    removeDuplicates: true,
  });

  const setSetting = (key: keyof typeof settings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    if (key === "removeDuplicates" && value === true) {
      setTokens(removeTokenDuplicates(tokens));
      return;
    }

    if (key === "includeLegacy" && value === false) {
      setTokens((prev) => prev.filter((token) => token.match(TOKEN_REGEX)));
    }
  };

  const addTokens = (newTokens: string[]) => {
    const preFiltered = [...new Set([...tokens, ...newTokens])];

    if (!settings.removeDuplicates) {
      setTokens(preFiltered);
      return;
    }

    setTokens(removeTokenDuplicates(preFiltered));
  };

  const removeToken = (token: string) => {
    setTokens((prev) => prev.filter((t) => t !== token));
  };

  const replaceTokens = (newTokens: string[]) => {
    const preFiltered = [...new Set(newTokens)];

    if (!settings.removeDuplicates) {
      setTokens(preFiltered);
      return;
    }

    setTokens(removeTokenDuplicates(preFiltered));
  };

  const importFromFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    for (const file of event.target.files) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (!event.target?.result) {
          return;
        }

        const result = event.target.result as string;
        const matches = getTokenMatchesForString(result);
        addTokens(matches);
      };
      reader.readAsText(file);
    }
  };

  return {
    tokens,
    addTokens,
    removeToken,
    replaceTokens,
    importFromFile,
    settings,
    setSetting,
  };
}
