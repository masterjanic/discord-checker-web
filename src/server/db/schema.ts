import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTableCreator,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

export const createTable = pgTableCreator((name) => `dtc-web_${name}`);

// Discord user model according to https://discord.com/developers/docs/resources/user
export const discordAccounts = createTable(
  "discordAccount",
  {
    // The user's Discord id
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    // The owner of this account
    ownerId: varchar("ownerId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // The user's username, not unique across the platform
    username: varchar("username", { length: 32 }).notNull(),
    // The user's Discord-tag
    discriminator: varchar("discriminator", { length: 4 }).notNull(),
    // The user's display name, if it is set. For bots, this is the application name.
    global_name: varchar("global_name", { length: 32 }),
    // The user's avatar hash
    avatar: varchar("avatar", { length: 255 }),
    // Whether the user belongs to an OAuth2 application
    bot: boolean("bot"),
    // Whether the user is an Official Discord System user (part of the urgent message system)
    system: boolean("system"),
    // Whether the user has two factor enabled on their account
    mfa_enabled: boolean("mfa_enabled"),
    // The user's banner hash
    banner: varchar("banner", { length: 255 }),
    // The user's banner color encoded as an integer representation of hexadecimal color code
    accent_color: integer("accent_color"),
    // The user's chosen language option
    locale: varchar("locale", { length: 6 }).default("en-US"),
    // Whether the email on this account has been verified
    verified: boolean("verified"),
    // The user's email
    email: varchar("email", { length: 255 }),
    // The flags on a user's account
    flags: bigint("flags", { mode: "number" }),
    // The type of Nitro subscription on a user's account
    premium_type: smallint("premium_type"),
    // The public flags on a user's account
    public_flags: bigint("public_flags", { mode: "number" }),
    // The user's avatar decoration hash
    avatar_decoration: varchar("avatar_decoration", { length: 255 }),
    // Undocumented fields
    // The user's phone number
    phone: varchar("phone", { length: 32 }),
    // Whether the user is allowed to see NSFW content
    nsfw_allowed: boolean("nsfw_allowed"),
    // The user's bio
    bio: varchar("bio", { length: 190 }),
    // The user's banner color
    banner_color: varchar("banner_color", { length: 255 }), // TODO: ??
    // Additional fields
    // A password to be used for logging in to the account
    password: varchar("password", { length: 255 }),
    // A number between 0 and 100 representing the account's trustworthiness
    rating: smallint("rating").notNull().default(0),
    // Custom notes about the account
    notes: varchar("notes", { length: 1024 }),
    // The date the account was created in the database
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (discordAccount) => ({
    // Add index on username and email for faster lookups
    usernameIdx: index("discordAccount_username_idx").on(
      discordAccount.username,
    ),
    emailIdx: index("discordAccount_email_idx").on(discordAccount.email),
    ownerIdIdx: index("discordAccount_ownerId_idx").on(discordAccount.ownerId),
  }),
);

export const discordAccountRelations = relations(
  discordAccounts,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [discordAccounts.ownerId],
      references: [users.id],
    }),
    tokens: many(discordTokens),
    histories: many(discordAccountHistories),
    // The collections this account is used in
    collections: many(discordAccountCollections),
  }),
);

export const discordTokens = createTable(
  "discordToken",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(createId),
    // The Discord account this token belongs to
    discordAccountId: varchar("discordAccountId", { length: 255 })
      .notNull()
      .references(() => discordAccounts.id, { onDelete: "cascade" }),
    // The token value
    value: varchar("value", { length: 255 }).notNull().unique(),
    // A short name of the application that was used to acquire this token
    origin: varchar("origin", { length: 64 }),
    lastCheckedAt: timestamp("lastCheckedAt").notNull().defaultNow(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (discordToken) => ({
    discordAccountIdIdx: index("discordToken_discordAccountId_idx").on(
      discordToken.discordAccountId,
    ),
  }),
);

export const discordTokenRelations = relations(discordTokens, ({ one }) => ({
  account: one(discordAccounts, {
    fields: [discordTokens.discordAccountId],
    references: [discordAccounts.id],
  }),
}));

// Track changes made to Discord accounts
export const discordAccountHistories = createTable(
  "discordAccountHistory",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(createId),
    // The Discord account this history entry belongs to
    discordAccountId: varchar("discordAccountId", { length: 255 })
      .notNull()
      .references(() => discordAccounts.id, { onDelete: "cascade" }),
    // All the changed fields of the account
    data: jsonb("data").notNull(),
    // The time the account was changed (when the change was detected)
    changedAt: timestamp("changedAt").notNull().defaultNow(),
  },
  (discordAccountHistory) => ({
    discordAccountIdIdx: index("discordAccountHistory_discordAccountId_idx").on(
      discordAccountHistory.discordAccountId,
    ),
  }),
);

export const discordAccountHistoryRelations = relations(
  discordAccountHistories,
  ({ one }) => ({
    account: one(discordAccounts, {
      fields: [discordAccountHistories.discordAccountId],
      references: [discordAccounts.id],
    }),
  }),
);

// Group Discord accounts into collections for easier management
export const discordAccountCollections = createTable(
  "discordAccountCollection",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(createId),
    // The user that owns this collection
    ownerId: varchar("ownerId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // A user-friendly name for the collection, e.g. "Spam Bots"
    name: varchar("name", { length: 32 }).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
    // The time the collection was deleted (soft delete)
    deletedAt: timestamp("deletedAt"),
  },
  (discordAccountCollection) => ({
    ownerIdIdx: index("discordAccountCollection_ownerId_idx").on(
      discordAccountCollection.ownerId,
    ),
  }),
);

export const discordAccountCollectionRelations = relations(
  discordAccountCollections,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [discordAccountCollections.ownerId],
      references: [users.id],
    }),
    accounts: many(discordAccounts),
  }),
);

// Used to link Discord accounts to collections
export const discordAccountCollectionsToDiscordAccounts = createTable(
  "discordAccountCollectionToDiscordAccount",
  {
    discordAccountId: varchar("discordAccountId", { length: 255 })
      .notNull()
      .references(() => discordAccounts.id, { onDelete: "cascade" }),
    discordAccountCollectionId: varchar("discordAccountCollectionId", {
      length: 255,
    })
      .notNull()
      .references(() => discordAccountCollections.id, { onDelete: "cascade" }),
  },
  (discordAccountCollectionToDiscordAccount) => ({
    compoundKey: primaryKey({
      columns: [
        discordAccountCollectionToDiscordAccount.discordAccountId,
        discordAccountCollectionToDiscordAccount.discordAccountCollectionId,
      ],
    }),
  }),
);

export const discordAccountCollectionToDiscordAccountRelations = relations(
  discordAccountCollectionsToDiscordAccounts,
  ({ one }) => ({
    account: one(discordAccounts, {
      fields: [discordAccountCollectionsToDiscordAccounts.discordAccountId],
      references: [discordAccounts.id],
    }),
    collection: one(discordAccountCollections, {
      fields: [
        discordAccountCollectionsToDiscordAccounts.discordAccountCollectionId,
      ],
      references: [discordAccountCollections.id],
    }),
  }),
);

// Keeps track of all events that are sent by the Sellix API
export const sellixEvents = createTable(
  "sellixEvent",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(createId),
    // The event name extracted from the data to allow for easier querying
    event: varchar("event", { length: 255 }).notNull(),
    // The full data of this event provided by the Sellix API
    data: jsonb("data").notNull(),
  },
  (sellixEvent) => ({
    eventIdx: index("sellixEvent_event_idx").on(sellixEvent.event),
  }),
);

// Stores the API keys for users to use our API
export const apiKeys = createTable(
  "apiKey",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(createId),
    // The user that owns this API key
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // A user-friendly name for the API key, e.g. "Development Key"
    name: varchar("name", { length: 32 }).notNull(),
    // A random UUID to be used as the API key
    value: uuid("value").notNull().defaultRandom().unique(),
    // Defines the allowed origins for this API key
    allowedIps: varchar("allowedIps", { length: 39 }).array(10).notNull(),
    // Defines the allowed requests per minute for this API key
    rateLimit: smallint("rateLimit").notNull().default(10),
    // The date this API key will expire, if null it will not expire
    expiresAt: timestamp("expiresAt"),
    // The date the API key was created
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    // The date the API key was deleted (soft delete)
    deletedAt: timestamp("deletedAt"),
  },
  (apiKey) => ({
    userIdIdx: index("apiKey_userId_idx").on(apiKey.userId),
  }),
);

export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
}));

export const userRoleEnum = pgEnum("user_role", ["CUSTOMER", "ADMIN"]);

export const UserRole = z.enum(userRoleEnum.enumValues).Enum;

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).defaultNow(),
  image: varchar("image", { length: 255 }),
  // Added fields
  // The users role which defines the permissions
  role: userRoleEnum("role").notNull().default("CUSTOMER"),
  // Whether the users public profile is visible to others
  publicProfile: boolean("publicProfile").notNull().default(true),
  // Whether the users name and image will be redacted from public statistics
  publicAnonymous: boolean("publicAnonymous").notNull().default(false),
  // For how long the user is still subscribed
  subscribedTill: timestamp("subscribedTill"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  apiKeys: many(apiKeys),
  discordAccounts: many(discordAccounts),
  discordAccountCollections: many(discordAccountCollections),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
