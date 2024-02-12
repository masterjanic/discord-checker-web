import countries from "~/consts/world_countries.json";

/**
 * The limit of free accounts that can be viewed in account overview.
 */
export const FREE_ACCOUNTS_LIMIT = 50;

/**
 * The url of the Discord API gateway to be used for requests.
 */
export const DISCORD_GATEWAY_URL = "https://discord.com/api/v10";

/**
 * The url of the Discord CDN to be used for requests.
 */
export const CDN_URL = "https://cdn.discordapp.com";

/**
 * The Discord epoch (2015-01-01T00:00:00.000Z).
 */
export const DISCORD_EPOCH = 1420070400000;

/**
 * The regex used to match a Discord token.
 */
export const TOKEN_REGEX = /[A-Za-z\d]{24,28}\.[\w-]{6}\.[\w-]{38}/g;

/**
 * Equivalent to TOKEN_REGEX, but matches legacy tokens.
 */
export const TOKEN_REGEX_LEGACY = /[A-Za-z\d]{24,28}\.[\w-]{6}\.[\w-]{27,38}/g;

/**
 * Mapping between Discord locales and 3-letter country codes.
 */
export const DISCORD_LOCALES_MAP = [
  ["da", "DNK"],
  ["de", "DEU"],
  ["en-GB", "GBR"],
  ["en-US", "USA"],
  ["es-ES", "ESP"],
  ["es-419", "MEX"],
  ["fr", "FRA"],
  ["hr", "HRV"],
  ["it", "ITA"],
  ["lt", "LTU"],
  ["hu", "HUN"],
  ["nl", "NLD"],
  ["no", "NOR"],
  ["pl", "POL"],
  ["pt-BR", "BRA"],
  ["ro", "ROU"],
  ["fi", "FIN"],
  ["sv-SE", "SWE"],
  ["vi", "VNM"],
  ["tr", "TUR"],
  ["cs", "CZE"],
  ["el", "GRC"],
  ["bg", "BGR"],
  ["ru", "RUS"],
  ["uk", "UKR"],
  ["hi", "IDN"],
  ["th", "THA"],
  ["zh-CN", "CHN"],
  ["ja", "JPN"],
  ["zh-TW", "TWN"],
  ["ko", "KOR"],
  // Found locales but not documented
  ["id", "IDN"],
  ["ar", "ARG"],
  ["he", "ISR"],
] as const;

/**
 * Returns the full country name for a given country code.
 * @param code The 3-letter country code.
 */
export const getCountryNameByCode = (code: string) => {
  const country = countries.features.find((country) => country.id === code);
  return country?.properties.name;
};

/**
 * Returns the full country name for a given locale.
 * @param locale The Discord locale.
 */
export const getCountryNameByLocale = (locale: string) => {
  const code = DISCORD_LOCALES_MAP.find(([code]) => code === locale)?.[1];
  return code ? getCountryNameByCode(code) : null;
};

/**
 * A mapping between Discord badge flags and their respective bit offsets.
 * Only includes flags that are saved as pictures.
 */
export const DISCORD_BADGE_FLAGS = Object.freeze({
  DISCORD_EMPLOYEE: 1 << 0,
  PARTNERED_SERVER_OWNER: 1 << 1,
  HYPESQUAD_EVENTS: 1 << 2,
  BUGHUNTER_LEVEL_1: 1 << 3,
  HOUSE_BRAVERY: 1 << 6,
  HOUSE_BRILLIANCE: 1 << 7,
  HOUSE_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  TEAM_USER: 1 << 10,
  BUGHUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT: 1 << 16,
  EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
  MODERATOR_PROGRAMS_ALUMNI: 1 << 18,
  ACTIVE_DEVELOPER: 1 << 22,
  SUPPORTS_COMMANDS: 1 << 23,
  USES_AUTOMOD: 1 << 24,
}) as Record<string, number>;

/**
 * A mapping between Discord undocumented flags and their respective bit offsets.
 */
export const DISCORD_UNDOCUMENTED_FLAGS = Object.freeze({
  MFA_SMS: 1 << 4,
  PREMIUM_PROMO_DISMISSED: 1 << 5,
  INTERNAL_APPLICATION: 1 << 11,
  HAS_UNREAD_URGENT_MESSAGES: 1 << 13,
  UNDERAGE_DELETED: 1 << 15,
  SPAMMER: 1 << 20,
  DISABLE_PREMIUM: 1 << 21,
  HIGH_GLOBAL_RATE_LIMIT: 1n << 33n,
  DELETED: 1n << 34n,
  DISABLED_SUSPICIOUS_ACTIVITY: 1n << 35n,
  SELF_DELETED: 1n << 36n,
  DISABLED: 1n << 41n,
  QUARANTINED: 1n << 44n,
}) as Record<string, number | bigint>;
