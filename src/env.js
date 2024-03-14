import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url().optional(),
    ),
    EMAIL_SERVER: z.string().url(),
    EMAIL_FROM: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    DISCORD_PUBLIC_KEY: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    SELLIX_API_KEY: z.string(),
    SELLIX_WEBHOOK_SECRET: z.string(),
  },

  client: {},

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    SELLIX_API_KEY: process.env.SELLIX_API_KEY,
    SELLIX_WEBHOOK_SECRET: process.env.SELLIX_WEBHOOK_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
