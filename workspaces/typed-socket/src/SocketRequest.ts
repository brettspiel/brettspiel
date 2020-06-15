import { GameRoom } from "@brettspiel/domain-types/lib/GameRoom";

export type ReqRes<Req, Res> = [Req, Res];
export type SocketRequestType = keyof SocketRequest;
export type SocketRequest = {
  "request/lounge/rooms": ReqRes<null, GameRoom[]>;
};
