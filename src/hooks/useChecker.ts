import pMap from "p-map";
import { useRef, useState } from "react";
import { fetchBillingCountry, fetchUser } from "~/lib/discord-api";
import { isValidSnowflake } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

interface IAccount {
  user: {
    id: string;
    username: string;
    discriminator: string;
    verified?: boolean;
    avatar: string | null;
    flags?: number;
  };
  tokens: string[];
}

export default function useChecker() {
  const { mutateAsync: createAccount } = api.account.create.useMutation();

  const pendingCancellation = useRef(false);

  const [isChecking, setIsChecking] = useState(false);
  const [accounts, setAccounts] = useState<IAccount[]>([]);

  const cancel = () => {
    pendingCancellation.current = true;
  };

  const existsByUserId = (id: string) =>
    accounts.some((acc) => acc.user.id === id);

  const addTokenByUserId = (id: string, token: string) => {
    setAccounts((state) => {
      return state.map((acc) => {
        if (acc.user.id === id) {
          return {
            ...acc,
            tokens: [...new Set([...acc.tokens, token])],
          };
        }

        return acc;
      });
    });
  };

  const checkTokens = (
    tokens: string[],
    removeToken: (token: string) => void,
  ) => {
    return pMap(
      tokens,
      async (token) => {
        if (pendingCancellation.current) {
          return;
        }

        removeToken(token);

        const base64Id = token.split(".")[0];
        if (!base64Id) {
          return;
        }

        const decodedId = atob(base64Id);
        if (!isValidSnowflake(decodedId)) {
          return;
        }

        if (existsByUserId(decodedId)) {
          const response = await fetchBillingCountry({ token });
          if (response) {
            addTokenByUserId(decodedId, token);
          }

          return;
        }

        const userResponse = await fetchUser("@me", { token });
        if (!userResponse) {
          return;
        }

        const { data: user } = userResponse;
        if (user.verified) {
          // Check if the user is "really" verified, since Discord sometimes returns verified = true for unverified users
          const billingCountryResponse = await fetchBillingCountry({ token });
          user.verified = billingCountryResponse !== null;
        }

        await createAccount({
          user,
          tokens: [token],
          origin: "DTC Web",
        });

        setAccounts((prev) => [
          ...prev,
          {
            user: {
              id: user.id,
              verified: user.verified,
              username: user.username,
              discriminator: user.discriminator,
              avatar: user.avatar,
            },
            tokens: [token],
          },
        ]);
      },
      { concurrency: 5, stopOnError: false },
    );
  };

  return {
    accounts,
    isChecking,
    setIsChecking,
    checkTokens,
    cancel,
  };
}
