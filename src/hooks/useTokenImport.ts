import { create } from "zustand";

import { TOKEN_REGEX } from "~/consts/discord";
import { removeTokenDuplicates } from "~/lib/discord-utils";

interface TokenImportState {
  pendingCancellation: boolean;
  running: boolean;
  tokens: string[];
  counts: {
    verified: number;
    unverified: number;
    flagged: number;
    nitro: number;
    invalid: number;
  };
  settings: {
    delay: number;
    includeLegacy: boolean;
    removeDuplicates: boolean;
  };
  updateSetting: (
    key: keyof TokenImportState["settings"],
    value: boolean | number,
  ) => void;
  updateCount: (
    key: keyof TokenImportState["counts"],
    increment?: number,
  ) => void;
  resetCounts: () => void;
  start: () => void;
  reset: () => void;
  cancel: () => void;
  addTokens: (newTokens: string[]) => void;
  removeTokens: (tokens: string[]) => void;
  clearTokens: () => void;
}

const defaultState = {
  pendingCancellation: false,
  running: false,
  paused: false,
  tokens: [],
  counts: {
    verified: 0,
    unverified: 0,
    flagged: 0,
    nitro: 0,
    invalid: 0,
  },
  settings: {
    delay: 0,
    includeLegacy: true,
    removeDuplicates: true,
  },
};

const useTokenImport = create<TokenImportState>((set) => ({
  ...defaultState,
  start: () => set({ running: true, pendingCancellation: false }),
  reset: () => set({ ...defaultState }),
  cancel: () => {
    set((state) => {
      if (state.running) {
        return { pendingCancellation: true, running: false, tokens: [] };
      }

      return state;
    });
  },
  updateSetting: (key, value) =>
    set((state) => {
      if (key === "removeDuplicates") {
        if (!state.settings.removeDuplicates && value === true) {
          return {
            settings: { ...state.settings, [key]: value },
            tokens: removeTokenDuplicates(state.tokens),
          };
        }
      }

      if (key === "includeLegacy" && value === false) {
        return {
          settings: { ...state.settings, [key]: value },
          tokens: state.tokens.filter((token) => token.match(TOKEN_REGEX)),
        };
      }

      return {
        settings: { ...state.settings, [key]: value },
      };
    }),
  resetCounts: () => set({ counts: { ...defaultState.counts } }),
  addTokens: (newTokens) =>
    set((state) => {
      // removes repeated tokens
      const filtered = [...new Set(newTokens)];
      if (state.settings.removeDuplicates) {
        return {
          tokens: removeTokenDuplicates([
            ...new Set([...state.tokens, ...filtered]),
          ]),
        };
      }

      return {
        tokens: [...new Set([...state.tokens, ...filtered])],
      };
    }),
  removeTokens: (tokens) =>
    set((state) => ({
      tokens: state.tokens.filter((token) => !tokens.includes(token)),
    })),
  updateCount: (key, increment = 1) =>
    set((state) => ({
      counts: { ...state.counts, [key]: state.counts[key] + increment },
    })),
  clearTokens: () => set({ tokens: [] }),
}));

export default useTokenImport;
