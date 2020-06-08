import { ChatLog } from "@brettspiel/domain-types/lib/ChatLog";
import { ChatLogSendRequest } from "@brettspiel/io-types/lib/socket/ChatLogSendRequest";

export type SocketEventType = keyof SocketEvent;
export type SocketEvent = {
  "client/lounge/chatSend": ChatLogSendRequest;
  "server/lounge/chatLog": ChatLog;

  "client/lounge/openRoom": "TicTacToe" | "Dominion";
  "server/lounge/roomStatusChange": "TicTacToe" | "Dominion";
};
