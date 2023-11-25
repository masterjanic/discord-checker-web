import { type DiscordAccount } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { FREE_ACCOUNTS_LIMIT, TOKEN_REGEX_LEGACY } from "~/consts/discord";
import { getOwnerId, isUserSubscribed } from "~/lib/auth";
import { fetchBilling, fetchGuilds } from "~/lib/discord-api";
import {
  getAccountRating,
  isFlagged,
  isValidSnowflake,
} from "~/lib/discord-utils";
import {
  activeSubscriptionProcedure,
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { fetchCached } from "~/server/redis/utils";

const zodUserShape = z.object({
  id: z.string().refine(isValidSnowflake),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullish(),
  email: z.string().nullish(),
  verified: z.boolean().optional(),
  accent_color: z.number().nullish(),
  banner: z.string().nullish(),
  bot: z.boolean().optional(),
  flags: z.number().optional(),
  global_name: z.string().nullish(),
  locale: z.string().optional(),
  mfa_enabled: z.boolean().optional(),
  premium_type: z.number().optional(),
  public_flags: z.number().optional(),
  system: z.boolean().optional(),
  phone: z.string().nullish(),
  nsfw_allowed: z.boolean().nullish(),
  bio: z.string().nullish(),
  banner_color: z.string().nullish(),
});

export const accountRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.discordAccount.findMany();
  }),
  get: protectedProcedure
    .input(z.string().refine(isValidSnowflake))
    .query(async ({ ctx, input }) => {
      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: getOwnerId(ctx.session.user),
        },
        include: {
          tokens: true,
        },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return account;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().refine(isValidSnowflake),
        password: z.string().optional(),
        notes: z.string().max(1024).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return ctx.db.discordAccount.update({
        where: {
          id,
          ownerId: getOwnerId(ctx.session.user),
        },
        data: {
          ...rest,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().refine(isValidSnowflake))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: getOwnerId(ctx.session.user),
        },
        select: {
          id: true,
        },
      });
      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.db.discordAccount.delete({
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        user: zodUserShape,
        tokens: z.array(z.string().regex(TOKEN_REGEX_LEGACY)),
        origin: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user, tokens, origin } = input;

      if (!isUserSubscribed(session.user)) {
        const totalAccounts = await db.discordAccount.count({
          where: {
            ownerId: session.user.id,
          },
        });
        if (totalAccounts >= FREE_ACCOUNTS_LIMIT) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `You must be subscribed to save more than ${FREE_ACCOUNTS_LIMIT} accounts.`,
          });
        }
      }

      await db.discordAccount.upsert({
        where: {
          id: user.id,
          ownerId: session.user.id,
        },
        create: {
          ...input.user,
          rating: getAccountRating(input.user as unknown as DiscordAccount),
          ownerId: session.user.id,
          tokens: {
            createMany: {
              data: tokens.map((token) => ({
                value: token,
                origin,
              })),
            },
          },
        },
        update: {
          ...input.user,
          rating: getAccountRating(input.user as unknown as DiscordAccount),
          tokens: {
            upsert: tokens.map((token) => ({
              where: {
                value: token,
              },
              create: {
                value: token,
                origin,
                lastCheckedAt: new Date(),
              },
              update: {
                lastCheckedAt: new Date(),
              },
            })),
          },
        },
      });
    }),
  getWithCursor: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        nitro: z.boolean().optional(),
        verified: z.boolean().optional(),
        phone: z.boolean().optional(),
        unflagged: z.boolean().optional(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, search, unflagged } = input;

      const items = await ctx.db.discordAccount.findMany({
        where: {
          OR: [
            {
              id: {
                contains: search ?? undefined,
              },
            },
            {
              username: {
                contains: search ?? undefined,
              },
            },
          ],
          phone: input.phone ? { not: null } : undefined,
          premium_type: input.nitro ? { gt: 0 } : undefined,
          verified: input.verified ? true : undefined,
          ownerId: getOwnerId(ctx.session.user),
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          username: true,
          discriminator: true,
          avatar: true,
          flags: true,
          premium_type: true,
          rating: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: !unflagged
          ? items
          : items.filter((item) => !isFlagged(item.flags)),
        nextCursor,
      };
    }),
  getGuilds: activeSubscriptionProcedure
    .input(z.string().refine(isValidSnowflake))
    .query(async ({ ctx, input }) => {
      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: getOwnerId(ctx.session.user),
        },
        select: {
          id: true,
          tokens: {
            orderBy: {
              lastCheckedAt: "desc",
            },
            take: 1,
          },
        },
      });
      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [token] = account.tokens;
      const guilds = await fetchCached(
        `discord:guilds:${account.id}`,
        () => fetchGuilds({ token: token!.value }),
        300,
      );
      return guilds ?? [];
    }),
  getBilling: activeSubscriptionProcedure
    .input(z.string().refine(isValidSnowflake))
    .query(async ({ ctx, input }) => {
      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: getOwnerId(ctx.session.user),
        },
        select: {
          id: true,
          tokens: {
            orderBy: {
              lastCheckedAt: "desc",
            },
            take: 1,
          },
        },
      });
      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [token] = account.tokens;
      const billing = await fetchCached(
        `discord:billing:${account.id}`,
        () => fetchBilling({ token: token!.value }),
        300,
      );
      return billing ?? [];
    }),
});
