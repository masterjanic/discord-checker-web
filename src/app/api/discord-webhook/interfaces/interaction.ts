import {
  type APIChatInputApplicationCommandInteraction,
  type APIInteractionResponse,
} from "discord-api-types/v10";

export interface ICommandOptions {
  req: Request;
  interaction: APIChatInputApplicationCommandInteraction;
  ping: number;
}

export type TCommandResponse =
  | Promise<APIInteractionResponse>
  | APIInteractionResponse;

export interface ICommand {
  execute: (opts: ICommandOptions) => TCommandResponse;
}

export interface ICommandHandler {
  command: ICommand;
}
