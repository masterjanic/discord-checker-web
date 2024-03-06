import axios, { type AxiosRequestConfig } from "axios";
import {
  type APIGuild,
  type APIUser,
  type RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";

import { DISCORD_GATEWAY_URL } from "~/consts/discord";

interface IRequestConfig extends AxiosRequestConfig {
  delay?: number;
  token?: string;
}

/**
 * Sends a request to the Discord api with the given data. If a rate limit is encountered, wait and retry.
 * @param config
 * @param retryCount
 */
async function apiRequest<ReturnType>(
  config: IRequestConfig,
  retryCount = 0,
): Promise<ReturnType | null> {
  const { delay, token, ...rest } = config;
  if (delay && delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (retryCount > 5) {
    return null;
  }

  try {
    const { data } = await axios.request<ReturnType>({
      ...rest,
      url: DISCORD_GATEWAY_URL + rest.url,
      headers: token ? { Authorization: token } : {},
    });

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (
        (err.response && err.response.status === 429) ??
        ["ECONNABORTED", "ERR_NETWORK"].includes(err.code!)
      ) {
        const retryHeader = err.response?.headers["Retry-After"] as string;
        const retryAfter = retryHeader
          ? parseInt(retryHeader, 10)
          : Math.pow(2, retryCount);

        return await apiRequest(
          {
            ...config,
            delay: retryAfter * 1000,
          },
          retryCount + 1,
        );
      }
    }

    return null;
  }
}

/**
 * Fetches a user from the Discord API. Use id "@me" to fetch the current user.
 * @param id
 * @param config
 */
export const fetchUser = async (id: string, config: IRequestConfig) => {
  const user = await apiRequest<APIUser>({
    ...config,
    url: `/users/${id}`,
  });

  if (user) {
    // remove fields , TODO: Check schema
    const toRemove = [
      "avatar_decoration_data",
      "linked_users",
      "authenticator_types",
    ] as const;
    for (const accessor of toRemove) {
      if (accessor in user) {
        delete (user as never)[accessor];
      }
    }
  }

  return user;
};

interface IBillingCountryResponse {
  country_code: string;
}

/**
 * Fetches the billing country for the current user.
 * @param config
 */
export const fetchBillingCountry = async (config: IRequestConfig) => {
  return apiRequest<IBillingCountryResponse>({
    ...config,
    url: "/users/@me/billing/country-code",
  });
};

/**
 * Fetches the guilds for the current user.
 * @param config
 * @param withCounts
 */
export const fetchGuilds = async (
  config: IRequestConfig,
  withCounts = true,
) => {
  return apiRequest<APIGuild[]>({
    ...config,
    url: `/users/@me/guilds?with_counts=${withCounts}`,
  });
};

/**
 * Fetches a guild from the Discord API.
 * @param id
 * @param config
 */
export const fetchGuild = async (id: string, config: IRequestConfig) => {
  return apiRequest<APIGuild>({
    ...config,
    url: `/guilds/${id}`,
  });
};

/**
 * Fetches the channels for a guild from the Discord API.
 * @param id
 * @param config
 */
export const fetchGuildChannels = async (
  id: string,
  config: IRequestConfig,
) => {
  return apiRequest<RESTGetAPIGuildChannelsResult>({
    ...config,
    url: `/guilds/${id}/channels`,
  });
};

interface IBillingObject {
  id: string;
  type: number;
  invalid: boolean;
  flags: number;
  last_4?: string;
  brand?: string;
  expires_month?: number;
  expires_year?: number;
  default: boolean;
  billing_address: {
    country: string;
    postal_code: string;
    name: string;
    line_1: string;
    line_2: string;
    city: string;
    state: string;
  };
  country: string;
  payment_gateway: number;
}

/**
 * Fetches the billing information (payment methods) for the current user.
 * @param config
 */
export const fetchBilling = async (config: IRequestConfig) => {
  return apiRequest<IBillingObject[]>({
    ...config,
    url: "/users/@me/billing/payment-sources",
  });
};

enum EDiscordRelationshipType {
  FRIEND = 1,
  BLOCKED = 2,
  INCOMING = 3,
  OUTGOING = 4,
}

interface IDiscordRelationship {
  id: string;
  type: EDiscordRelationshipType;
  user: APIUser;
  since?: string;
}

/**
 * Fetches friend relationships for the current user.
 */
export const fetchFriends = async (config: IRequestConfig) => {
  return apiRequest<IDiscordRelationship[]>({
    ...config,
    url: "/users/@me/relationships",
  });
};
