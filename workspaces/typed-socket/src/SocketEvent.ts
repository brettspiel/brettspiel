import { ChatLog } from "../domain/ChatLog";
import { ChatLogSendRequest } from "./ChatLogSendRequest";

export type SocketEventType = keyof SocketEvent;
export type SocketEvent = {
  "client/lounge/chatSend": ChatLogSendRequest;
  "server/lounge/chatLog": ChatLog;
};
