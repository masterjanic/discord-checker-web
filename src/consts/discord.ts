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
  ["ar", "ARG"],
  ["bg", "BGR"],
  ["zh-CN", "CHN"],
  ["zh-TW", "TWN"],
  ["hr", "HUN"],
  ["cs", "CZE"],
  ["da", "DNK"],
  ["nl", "NLD"],
  ["en-GB", "GBR"],
  ["en-US", "USA"],
  ["fi", "FIN"],
  ["fr", "FRA"],
  ["de", "DEU"],
  ["el", "GRC"],
  ["hi", "IDN"],
  ["hu", "HUN"],
  ["id", "IDN"],
  ["it", "ITA"],
  ["ja", "JPN"],
  ["ko", "KOR"],
  ["lt", "LTU"],
  ["no", "NOR"],
  ["pl", "POL"],
  ["pt-BR", "BRA"],
  ["ro", "ROU"],
  ["ru", "RUS"],
  ["es-ES", "ESP"],
  ["sv-SE", "SWE"],
  ["th", "THA"],
  ["tr", "TUR"],
  ["uk", "UKR"],
  ["vi", "VNM"],
] as const;

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
