import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TOKEN_REGEX_LEGACY } from "~/consts/discord";
import { getOwnerId } from "~/lib/auth";
import { fetchBilling, fetchGuilds } from "~/lib/discord-api";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

const zodUserShape = z.object({
  id: z.string().min(17),
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
    .input(z.string().min(17))
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
  delete: protectedProcedure
    .input(z.string().min(17))
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

      await db.discordAccount.upsert({
        where: {
          id: user.id,
          ownerId: session.user.id,
        },
        create: {
          ...input.user,
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
        nitroOnly: z.boolean().optional(),
        verifiedOnly: z.boolean().optional(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, search } = input;

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
          premium_type: input.nitroOnly ? { gt: 0 } : undefined,
          verified: input.verifiedOnly ? input.verifiedOnly : undefined,
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
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
  getGuilds: protectedProcedure
    .input(z.string().min(17))
    .query(async ({ ctx, input }) => {
      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: getOwnerId(ctx.session.user),
        },
        select: {
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
      if (!token) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const response = await fetchGuilds({
        token: token.value,
      });
      return response?.data ?? [];
    }),
  getBilling: protectedProcedure
    .input(z.string().min(17))
    .query(async ({ ctx, input }) => {
      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: getOwnerId(ctx.session.user),
        },
        select: {
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
      if (!token) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const response = await fetchBilling({
        token: token.value,
      });

      return response?.data ?? [];
    }),
});
