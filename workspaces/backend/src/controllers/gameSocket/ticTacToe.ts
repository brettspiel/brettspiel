import { WebsocketRequestHandler } from "express-ws";
import { SocketMessage } from "@brettspiel/io-types/lib/socket/SocketMessage";

export const ticTacToe: WebsocketRequestHandler = (ws, req) => {
  ws.on("message", (rawData) => {
    const decoded = SocketMessage.decode(rawData);
    if (decoded.isLeft()) return;
    const { type, payload } = decoded.unsafeCoerce();
  });
};
