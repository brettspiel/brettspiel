import {
  array,
  Codec,
  exactly,
  GetInterface,
  oneOf,
  optional,
} from "purify-ts";
import { User } from "./User";

export type GameType = GetInterface<typeof GameType>;
export const GameType = oneOf([exactly("TicTacToe"), exactly("Hex")]);

export type GameRoom = GetInterface<typeof GameRoom>;
export const GameRoom = Codec.interface({
  type: GameType,
  status: oneOf([exactly("initial"), exactly("wanted"), exactly("started")]),
  host: optional(User),
  players: optional(array(User)),
});
