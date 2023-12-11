import { type DiscordAccount, type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { FREE_ACCOUNTS_LIMIT, TOKEN_REGEX_LEGACY } from "~/consts/discord";
import { getOwnerId, isUserSubscribed } from "~/lib/auth";
import { getLatestTokenByAccountId } from "~/lib/db/accounts";
import { fetchBilling, fetchGuilds, fetchUser } from "~/lib/discord-api";
import {
  getAccountRating,
  hasChanged,
  isFlagged,
  isValidSnowflake,
  type TCompareableUser,
} from "~/lib/discord-utils";
import {
  activeSubscriptionProcedure,
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { fetchCached } from "~/server/redis/utils";
import { api } from "~/trpc/server";

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
        tokens: z.array(z.string().regex(TOKEN_REGEX_LEGACY)).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tokens, ...rest } = input;
      return ctx.db.discordAccount.update({
        where: {
          id,
          ownerId: getOwnerId(ctx.session.user),
        },
        data: {
          ...rest,
          tokens: {
            set: tokens
              ? tokens.map((token) => ({
                  value: token,
                }))
              : undefined,
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().refine(isValidSnowflake))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.discordAccount.delete({
        where: {
          id: input,
          ownerId: getOwnerId(ctx.session.user),
        },
      });
    }),
  deleteAll: protectedProcedure
    .input(z.object({ adminOverride: z.boolean().optional() }).optional())
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      return ctx.db.discordAccount.deleteMany({
        where: {
          ownerId: input && input.adminOverride ? getOwnerId(user) : user.id,
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

      await db.$transaction(async (tx) => {
        const currentAccount = await tx.discordAccount.findUnique({
          where: {
            id: user.id,
          },
          select: {
            email: true,
            phone: true,
            username: true,
            discriminator: true,
            avatar: true,
            premium_type: true,
            accent_color: true,
            bio: true,
            banner: true,
            banner_color: true,
            global_name: true,
            avatar_decoration: true,
            mfa_enabled: true,
            verified: true,
            flags: true,
            public_flags: true,
          },
        });

        await db.discordAccount.upsert({
          where: {
            id: user.id,
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
            history: {
              create: hasChanged(
                currentAccount as unknown as TCompareableUser,
                input.user as unknown as TCompareableUser,
              )
                ? {
                    data: currentAccount as Prisma.JsonObject,
                  }
                : undefined,
            },
          },
        });
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
      const token = await getLatestTokenByAccountId(
        input,
        getOwnerId(ctx.session.user),
      );
      if (!token) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const guilds = await fetchCached(
        `discord:guilds:${input}`,
        () => fetchGuilds({ token: token.value }),
        300,
      );
      return guilds ?? [];
    }),
  getBilling: activeSubscriptionProcedure
    .input(z.string().refine(isValidSnowflake))
    .query(async ({ ctx, input }) => {
      const token = await getLatestTokenByAccountId(
        input,
        getOwnerId(ctx.session.user),
      );
      if (!token) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const billing = await fetchCached(
        `discord:billing:${input}`,
        () => fetchBilling({ token: token.value }),
        300,
      );
      return billing ?? [];
    }),
  recheck: protectedProcedure
    .input(z.string().refine(isValidSnowflake))
    .mutation(async ({ ctx, input: id }) => {
      const { db, session } = ctx;
      const account = await db.discordAccount.findUnique({
        where: {
          id,
          ownerId: getOwnerId(session.user),
        },
        select: {
          tokens: {
            orderBy: {
              lastCheckedAt: "asc",
            },
          },
        },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      let validTokens = account.tokens.length;
      for (const token of account.tokens) {
        const user = await fetchUser("@me", { token: token.value });

        if (!user) {
          validTokens--;
          if (validTokens === 0) {
            await api.account.delete.mutate(id);
            continue;
          }

          await api.account.update.mutate({
            id,
            tokens: account.tokens
              .filter((t) => t.value !== token.value)
              .map((t) => t.value),
          });
          continue;
        }

        await api.account.create.mutate({
          user,
          tokens: [token.value],
          origin: token.origin ?? undefined,
        });
      }
    }),
  getHistory: activeSubscriptionProcedure
    .input(z.string().refine(isValidSnowflake))
    .query(({ ctx, input: id }) => {
      const { db, session } = ctx;
      return db.discordAccountHistory.findMany({
        where: {
          discordAccount: {
            id,
            ownerId: getOwnerId(session.user),
          },
        },
        orderBy: {
          changedAt: "desc",
        },
        select: {
          id: true,
          data: true,
          changedAt: true,
          discordAccount: true,
        },
        take: 5,
      });
    }),
});
