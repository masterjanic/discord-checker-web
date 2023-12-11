import {
  type APIInteraction,
  type APIInteractionResponse,
} from "discord-api-types/v10";

export interface ICommandOptions {
  req: Request;
  interaction: APIInteraction;
}

export type TCommandResponse =
  | Promise<APIInteractionResponse>
  | APIInteractionResponse;

export interface ICommand {
  execute: (opts: ICommandOptions) => TCommandResponse;
}
