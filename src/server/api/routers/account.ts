import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TOKEN_REGEX_LEGACY } from "~/consts/discord";
import { fetchGuilds } from "~/lib/discord-api";
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
      const { user } = ctx.session;
      const isAdmin = user.role === Role.ADMIN;

      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: isAdmin ? undefined : user.id,
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
      const { user } = ctx.session;
      const isAdmin = user.role === Role.ADMIN;

      const limit = input.limit ?? 50;
      const cursor = input.cursor;
      const search = input.search;

      // TODO: Implement search query operators
      let searchQuery = {};
      if (search) {
        const [key, value] = search.split(":");
        if (key && value) {
          searchQuery = {
            [key]: {
              search: value,
            },
          };
        }
      }

      const items = await ctx.db.discordAccount.findMany({
        where: {
          ...searchQuery,
          premium_type: input.nitroOnly ? { gt: 0 } : undefined,
          verified: input.verifiedOnly ? input.verifiedOnly : undefined,
          ownerId: isAdmin ? undefined : user.id,
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
      const { user } = ctx.session;
      const isAdmin = user.role === Role.ADMIN;

      const account = await ctx.db.discordAccount.findUnique({
        where: {
          id: input,
          ownerId: isAdmin ? undefined : user.id,
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
});
