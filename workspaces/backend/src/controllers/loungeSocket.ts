import { WebsocketRequestHandler } from "express-ws";
import { SocketMessage } from "@brettspiel/io-types/lib/socket/SocketMessage";
import { ChatLogSendRequest } from "@brettspiel/io-types/lib/socket/ChatLogSendRequest";
import { loungeChatStore } from "../stores/ChatStore";

export const loungeSocket: WebsocketRequestHandler = (ws, req) => {
  ws.on("message", (rawData) => {
    const decoded = SocketMessage.decode(rawData);
    if (decoded.isLeft()) return;
    const { type, payload } = decoded.unsafeCoerce();

    if (type === "ChatLogSend") {
      ChatLogSendRequest.decode(payload)
        .map(({ user, message }) => loungeChatStore.insert(user, message))
        .either(
          () => {},
          (chatLog) =>
            req.broadcast(
              SocketMessage.encode({
                type: "/lounge/chat/AddMessage",
                payload: chatLog,
              })
            )
        );
    }
  });
};
