import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getOwnerId } from "~/lib/auth";
import { getLatestTokenByAccountId } from "~/lib/db/accounts";
import { fetchGuild, fetchGuildChannels, fetchGuilds } from "~/lib/discord-api";
import { isValidSnowflake } from "~/lib/discord-utils";
import {
  activeSubscriptionProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";
import { fetchCached } from "~/server/redis/utils";

export const accountGuildRouter = createTRPCRouter({
  getAll: activeSubscriptionProcedure
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
  get: activeSubscriptionProcedure
    .input(
      z.object({
        userId: z.string().refine(isValidSnowflake),
        guildId: z.string().refine(isValidSnowflake),
      }),
    )
    .query(async ({ ctx, input }) => {
      const token = await getLatestTokenByAccountId(
        input.userId,
        getOwnerId(ctx.session.user),
      );
      if (!token) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return await fetchCached(
        `discord:guild:${input.guildId}`,
        () => fetchGuild(input.guildId, { token: token.value }),
        300,
      );
    }),
  getChannels: activeSubscriptionProcedure
    .input(
      z.object({
        userId: z.string().refine(isValidSnowflake),
        guildId: z.string().refine(isValidSnowflake),
      }),
    )
    .query(async ({ ctx, input }) => {
      const token = await getLatestTokenByAccountId(
        input.userId,
        getOwnerId(ctx.session.user),
      );
      if (!token) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return await fetchCached(
        `discord:guild:${input.guildId}:channels`,
        () => fetchGuildChannels(input.guildId, { token: token.value }),
        300,
      );
    }),
});
