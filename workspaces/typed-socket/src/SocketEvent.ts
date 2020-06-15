import { ChatLog } from "@brettspiel/domain-types/lib/ChatLog";
import { ChatLogSendRequest } from "@brettspiel/io-types/lib/socket/ChatLogSendRequest";
import { GameType, GameRoom } from "@brettspiel/domain-types/lib/GameRoom";

export type SocketEventType = keyof SocketEvent;
export type SocketEvent = {
  "client/lounge/chatSend": ChatLogSendRequest;
  "server/lounge/chatLog": ChatLog;

  "client/lounge/openRoom": GameType;
  "server/lounge/roomStatusChange": GameRoom[];
};
