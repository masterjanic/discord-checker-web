import { db } from "~/server/db";

/**
 * Returns the latest last checked token for a given account id and owner id.
 * @param id
 * @param ownerId
 */
export const getLatestTokenByAccountId = async (
  id: string,
  ownerId: string | undefined,
) => {
  const account = await db.discordAccount.findUnique({
    where: {
      id,
      ownerId,
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
  return account?.tokens?.[0];
};
