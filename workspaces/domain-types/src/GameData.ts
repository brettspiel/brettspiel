import {
  array,
  Codec,
  exactly,
  GetInterface,
  number,
  oneOf,
  string,
} from "purify-ts";

export type GameData = GetInterface<typeof GameData>;
export const GameData = Codec.interface({
  name: string,
  minPlayers: number,
  maxPlayers: number,
  categories: array(
    oneOf([exactly("abstract"), exactly("card"), exactly("party")])
  ),
  weight: oneOf([exactly("light"), exactly("middle"), exactly("heavy")]),
  minPlayingMinutes: number,
  maxPlayingMinutes: number,
});
