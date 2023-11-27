import { type DiscordAccount } from "@prisma/client";
import { type APIUser } from "discord-api-types/v10";

import {
  DISCORD_BADGE_FLAGS,
  DISCORD_EPOCH,
  DISCORD_LOCALES_MAP,
  DISCORD_UNDOCUMENTED_FLAGS,
  TOKEN_REGEX,
  TOKEN_REGEX_LEGACY,
} from "~/consts/discord";

/**
 * Function to convert a locale to a country code.
 * Returns "USA" if the locale is not found.
 * @param locale
 */
export const localeToCountry = (locale: string | null) => {
  const entry = DISCORD_LOCALES_MAP.find(([code]) => code === locale);
  return entry ? entry[1] : "USA";
};

/**
 * Function to convert a string to title case.
 * @param str
 */
export const toTitleCase = (str: string): string => {
  return str.replaceAll(/[_-]/g, " ").replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

/**
 * Function to check if a user is migrated to the new username system.
 * @param discriminator
 */
export const isMigratedUser = (discriminator: string) => {
  return discriminator === "0";
};

/**
 * Function to return the username or tag of a user.
 * @param username
 * @param discriminator
 */
export const usernameOrTag = ({
  username,
  discriminator,
}: {
  username: string;
  discriminator: string;
}) => {
  if (isMigratedUser(discriminator)) {
    return `@${username}`;
  }

  return `${username}#${discriminator}`;
};

/**
 * Function to check if a user has a specific flag.
 * @param flags
 * @param bit
 * @param mapping
 */
export const hasFlag = (
  flags: number | bigint | undefined | null,
  bit: string,
  mapping: Record<string, number | bigint> = DISCORD_BADGE_FLAGS,
): boolean => {
  if (!flags) {
    return false;
  }

  const flagForBit = mapping[bit];
  if (!flagForBit) {
    return false;
  }

  return (BigInt(flags) & BigInt(flagForBit)) === BigInt(flagForBit);
};

/**
 * Converts a Discord snowflake id to a milliseconds timestamp.
 * @param snowflake
 */
export const snowflakeToMilliseconds = (snowflake: string): number => {
  return Number(snowflake) / 4194304 + DISCORD_EPOCH;
};

/**
 * Checks if the given snowflake is valid.
 * @param snowflake
 */
export const isValidSnowflake = (snowflake: string): boolean => {
  if (!/^\d+$/.test(snowflake)) {
    return false;
  }

  const creationMilliseconds = snowflakeToMilliseconds(snowflake);
  return (
    creationMilliseconds > DISCORD_EPOCH && creationMilliseconds < Date.now()
  );
};

/**
 * Function to get all token matches for a string.
 * @param str
 * @param includeLegacy
 */
export const getTokenMatchesForString = (str: string, includeLegacy = true) => {
  const regex = includeLegacy ? TOKEN_REGEX_LEGACY : TOKEN_REGEX;
  return str.match(regex) ?? [];
};

/**
 * Function to remove duplicate tokens from an array.
 * Checks the first part of the token which represents the user id.
 * @param tokens
 */
export const removeTokenDuplicates = (tokens: string[]) => {
  const seen = new Set<string>();
  return tokens.filter((token) => {
    const [firstPart] = token.split(".");
    if (!firstPart || seen.has(firstPart)) {
      return false;
    }

    seen.add(firstPart);
    return true;
  });
};

const DISABLED_FLAGS = [
  "DISABLED",
  "DELETED",
  "DISABLED_SUSPICIOUS_ACTIVITY",
  "SELF_DELETED",
  "UNDERAGE_DELETED",
] as const;

const CRITICAL_FLAGS = [
  "SPAMMER",
  "QUARANTINED",
  "HIGH_GLOBAL_RATE_LIMIT",
] as const;

/**
 * Function to check whether an account can be logged into.
 */
export const canLogin = (flags: number | bigint | undefined | null) => {
  if (!flags) {
    return true;
  }

  for (const flag of DISABLED_FLAGS) {
    if (hasFlag(flags, flag, DISCORD_UNDOCUMENTED_FLAGS)) {
      return false;
    }
  }

  return true;
};

/**
 * Function to check whether an account is flagged as critical.
 * @param flags
 */
export const isFlagged = (flags: number | bigint | undefined | null) => {
  if (!flags) {
    return false;
  }

  for (const flag of CRITICAL_FLAGS) {
    if (hasFlag(flags, flag, DISCORD_UNDOCUMENTED_FLAGS)) {
      return true;
    }
  }

  return false;
};

/**
 * Function to generate the SQL query for the critical flags.
 */
export const generateFlaggedAccountsQuery = () => {
  const flags = CRITICAL_FLAGS.map((flag) => {
    return `(flags & ${DISCORD_UNDOCUMENTED_FLAGS[flag]} = ${DISCORD_UNDOCUMENTED_FLAGS[flag]})`;
  });

  return `(${flags.join(" OR ")})`;
};

/**
 * Function to give Discord accounts a rating from 0 to 100.
 */
export const getAccountRating = (
  user: Pick<
    DiscordAccount,
    | "verified"
    | "flags"
    | "premium_type"
    | "mfa_enabled"
    | "phone"
    | "id"
    | "discriminator"
    | "avatar"
    | "username"
    | "bio"
  >,
) => {
  let rating = 0;

  if (user.verified) {
    rating += 30;
  }

  if (user.premium_type && user.premium_type > 0) {
    rating += 20;
  }

  if (user.mfa_enabled) {
    rating += 10;
  }

  if (user.phone) {
    rating += 20;
  }

  if (!canLogin(user.flags)) {
    rating -= 50;
  }

  if (isFlagged(user.flags)) {
    rating -= 20;
  }

  if (isMigratedUser(user.discriminator)) {
    rating += 10;
  }

  if (user.avatar) {
    rating += 5;
  }

  if (user.bio && user.bio.length > 0) {
    rating += 5;
  }

  const createdAt = snowflakeToMilliseconds(user.id);
  const now = Date.now();
  const ageDays = Math.floor((now - createdAt) / 1000 / 60 / 60 / 24);
  const ageRating = Math.min(20, ageDays / 7);
  rating += Math.round(ageRating);

  return Math.max(0, Math.min(100, rating));
};

/**
 * Function to format a phone number.
 * @param phoneNumber
 */
export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
};

export type TCompareableUser = APIUser & {
  phone: string | null;
  bio: string | null;
  banner_color: string | null;
};

/**
 * Function to check if a user has changed.
 * @param oldUser
 * @param newUser
 */
export const hasChanged = (
  oldUser: TCompareableUser,
  newUser: TCompareableUser,
) => {
  const toCheck = [
    "email",
    "phone",
    "username",
    "discriminator",
    "avatar",
    "premium_type",
    "accent_color",
    "bio",
    "banner",
    "banner_color",
    "global_name",
    "avatar_decoration",
    "mfa_enabled",
    "verified",
    "flags",
    "public_flags",
  ] as const;

  for (const key of toCheck) {
    if (oldUser[key] != newUser[key]) {
      return true;
    }
  }

  return false;
};
