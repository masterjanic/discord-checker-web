import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { DISCORD_GATEWAY_URL } from "~/consts/discord";
import { type APIGuild, type APIUser } from "discord-api-types/v10";

interface IRequestConfig extends AxiosRequestConfig {
  delay?: number;
  token?: string;
}

/**
 * Sends a request to the Discord api with the given data. If a rate limit is encountered, wait and retry.
 * @param config
 */
async function apiRequest<ReturnType>(
  config: IRequestConfig,
): Promise<AxiosResponse<ReturnType> | null> {
  const { delay, token, ...rest } = config;
  if (delay && delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  try {
    return await axios.request<ReturnType>({
      ...rest,
      url: DISCORD_GATEWAY_URL + rest.url,
      headers: token ? { Authorization: token } : {},
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 429) {
        const retryAfter = Number(err.response.headers["Retry-After"] ?? 1);
        return await apiRequest({
          ...config,
          delay: retryAfter * 1000,
        });
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
  return apiRequest<APIUser>({
    ...config,
    url: `/users/${id}`,
  });
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
