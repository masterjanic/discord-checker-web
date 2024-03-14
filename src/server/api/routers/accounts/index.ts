import { accountsBillingRouter } from "~/server/api/routers/accounts/billing";
import { accountsGuildsRouter } from "~/server/api/routers/accounts/guilds";
import { createTRPCRouter } from "~/server/api/trpc";

export const accountsRouter = createTRPCRouter({
  billing: accountsBillingRouter,
  guilds: accountsGuildsRouter,
});
