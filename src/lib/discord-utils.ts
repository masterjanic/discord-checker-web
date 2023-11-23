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
  return str.replaceAll("_", " ").replace(/\w\S*/g, function (txt) {
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
 * Function to generate the SQL query for the disabled flags.
 */
export const generateDisabledFlagsSQL = () => {
  const flags = DISABLED_FLAGS.map((flag) => {
    return `(flags & ${DISCORD_UNDOCUMENTED_FLAGS[flag]} = ${DISCORD_UNDOCUMENTED_FLAGS[flag]})`;
  });

  return flags.join(" OR ");
};
