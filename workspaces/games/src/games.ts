import { GameType } from "@brettspiel/domain-types/lib/GameRoom";
import { GameData } from "@brettspiel/domain-types/lib/GameData";

export const games: {
  [Type in GameType]: GameData;
} = {
  TicTacToe: {
    name: "マルバツゲーム",
    minPlayers: 2,
    maxPlayers: 2,
    categories: ["abstract"],
    weight: "light",
    minPlayingMinutes: 1,
    maxPlayingMinutes: 3,
  },
  Hex: {
    name: "Hex",
    minPlayers: 2,
    maxPlayers: 2,
    categories: ["abstract"],
    weight: "middle",
    minPlayingMinutes: 10,
    maxPlayingMinutes: 30,
  },
};
