import {
  array,
  Codec,
  exactly,
  GetInterface,
  oneOf,
  optional,
} from "purify-ts";
import { User } from "./User";
import { NonEmptyString } from "purify-ts-extra-codec";

export type GameType = GetInterface<typeof GameType>;
export const GameType = oneOf([exactly("TicTacToe"), exactly("Hex")]);

export type GameRoom = GetInterface<typeof GameRoom>;
export const GameRoom = Codec.interface({
  id: NonEmptyString,
  type: GameType,
  status: oneOf([exactly("wanted"), exactly("started"), exactly("ended")]),
  host: User,
  players: array(User),
});
