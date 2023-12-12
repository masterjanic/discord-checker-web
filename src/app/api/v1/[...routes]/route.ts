import { type NextRequest } from "next/server";

import { apiMiddleware, ApiMiddlewareError } from "~/app/api/v1/middleware";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

interface IApiActionProps {
  userId: string;
}

interface IApiAction {
  GET?: {
    executor: (props: IApiActionProps) => Promise<object | null>;
  };
  POST?: {
    executor: (props: IApiActionProps) => Promise<object | null>;
  };
}

const actions: Record<string, IApiAction> = {
  "/accounts": {
    GET: {
      executor: async ({ userId }) => {
        const data = await db.discordAccount.findMany({
          where: {
            ownerId: userId,
          },
          include: {
            tokens: true,
            history: true,
          },
        });

        return data.map((acc) => ({
          ...acc,
          flags: Number(acc.flags),
          public_flags: Number(acc.public_flags),
        }));
      },
    },
  },
  "/collections": {
    GET: {
      executor: ({ userId }) => {
        return db.discordAccountCollection.findMany({
          where: {
            ownerId: userId,
          },
          include: {
            _count: {
              select: {
                accounts: true,
              },
            },
          },
        });
      },
    },
  },
  "/profile": {
    GET: {
      executor: ({ userId }) => {
        return db.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            _count: {
              select: {
                discordAccounts: true,
                discordAccountCollections: true,
              },
            },
          },
        });
      },
    },
  },
};

const handler = async (req: NextRequest) => {
  let responseHeaders = {};
  let userId: string | null = null;
  try {
    const { headers, userId: user } = await apiMiddleware(req);
    responseHeaders = headers;
    userId = user;
  } catch (err) {
    if (err instanceof ApiMiddlewareError) {
      return Response.json(
        {
          code: err.cause ?? 500,
          message: err.message,
        },
        { status: err.cause ?? 500, headers: err.headers },
      );
    }

    return Response.json(
      {
        code: 500,
        message: "Internal server error.",
      },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const actionName = url.pathname.split("/api/v1")[1];
  if (!actionName || !actions[actionName]) {
    return Response.json(
      {
        code: 404,
        message: "Invalid action.",
      },
      { status: 404, headers: responseHeaders },
    );
  }

  const action = actions[actionName]!;
  const method = req.method;
  if (!(method in action)) {
    return Response.json(
      {
        code: 405,
        message: "Invalid request method for this action.",
      },
      { status: 404, headers: responseHeaders },
    );
  }

  const data = await action[method as "GET" | "POST"]!.executor({ userId });
  return Response.json(
    { code: 200, message: "OK", data },
    {
      status: 200,
      headers: responseHeaders,
    },
  );
};

export { handler as GET, handler as POST };
