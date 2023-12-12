import {
  InteractionType,
  type APIChatInputApplicationCommandInteraction,
  type APIInteraction,
} from "discord-api-types/v10";
import nacl from "tweetnacl";

import { type ICommandHandler } from "~/app/api/discord-webhook/interfaces/interaction";
import { env } from "~/env";
import { snowflakeToMilliseconds } from "~/lib/discord-utils";

export const dynamic = "force-dynamic";

const handler = async (req: Request) => {
  const receivedAt = Date.now();

  const isDevelopment = env.NODE_ENV === "development";

  const PUBLIC_KEY = env.DISCORD_PUBLIC_KEY;

  const signature = req.headers.get("X-Signature-Ed25519");
  const timestamp = req.headers.get("X-Signature-Timestamp");

  if ((!signature || !timestamp) && !isDevelopment) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.text();

  if (!isDevelopment) {
    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature!, "hex"),
      Buffer.from(PUBLIC_KEY, "hex"),
    );

    if (!isVerified) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const interaction = JSON.parse(body) as APIInteraction;

  if (interaction.type === InteractionType.Ping) {
    return Response.json({ type: 1 }, { status: 200 });
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const ping = receivedAt - snowflakeToMilliseconds(interaction.id);
    try {
      const { command } = (await import(
        `~/app/api/discord-webhook/commands/${interaction.data.name}`
      )) as ICommandHandler;
      const result = await command.execute({
        req,
        interaction: interaction as APIChatInputApplicationCommandInteraction,
        ping,
      });
      return Response.json(result, { status: 200 });
    } catch (err) {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

export { handler as POST };
