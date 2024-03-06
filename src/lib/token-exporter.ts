import { type DiscordAccount } from "@prisma/client";

type MakeOptional<T> = {
  [K in keyof T]?: T[K];
};

interface IExportableAccount extends MakeOptional<DiscordAccount> {
  tokens: {
    value: string;
  }[];
}

class TokenExporter {
  private readonly accounts: IExportableAccount[];

  constructor(accounts: IExportableAccount[]) {
    this.accounts = accounts;
  }

  toCSV() {
    const header = Object.keys(this.accounts[0]!)
      .filter((k) => k !== "tokens")
      .join(",");
    const accounts = this.accounts.map(({ tokens, ...account }) => {
      const details = Object.values(account).join(",");
      const joinedTokens = tokens.map((token) => token.value).join("\n");

      return [details, joinedTokens].join(",");
    });

    return [header.concat(",tokens"), ...accounts].join("\n");
  }

  toJSON() {
    return JSON.stringify(
      this.accounts,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (key, value) => (typeof value === "bigint" ? `${value}` : value),
      2,
    );
  }

  toPlain() {
    return this.accounts
      .map(({ tokens, ...account }) => {
        const details = Object.entries(account)
          .map(([key, value]) => `${key}: ${(value as string) ?? "N/A"}`)
          .join(", ");
        const joinedTokens = tokens.map((token) => token.value).join("\n");

        return [details, joinedTokens].join("\n");
      })
      .join("\n");
  }
}

export default TokenExporter;
