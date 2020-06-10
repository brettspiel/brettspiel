import { array, Codec, GetInterface } from "purify-ts";
import { GameRoom } from "@brettspiel/domain-types/lib/GameRoom";

export type GameRoomListResponse = GetInterface<typeof GameRoomListResponse>;
export const GameRoomListResponse = Codec.interface({
  rooms: array(GameRoom),
});
