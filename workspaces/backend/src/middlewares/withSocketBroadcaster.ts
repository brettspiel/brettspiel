import { WebsocketRequestHandler } from "express-ws";
import WebSocket from "ws";
import { SocketMessage } from "@brettspiel/io-types/lib/socket/SocketMessage";

let sockets = new Map<string, WebSocket>();

export const withSocketBroadcaster: WebsocketRequestHandler = (
  ws,
  req,
  next
) => {
  if (!req.user)
    throw new Error(
      `withSocketBroadcaster must be used in authorized socket context.`
    );

  sockets.set(req.user.id, ws);
  ws.on("close", () => {
    if (!req.user) throw new Error(`Unexpected user request mutation.`);
    sockets.delete(req.user.id);
  });

  req.broadcast = (data: SocketMessage) => {
    for (const socket of sockets.values()) {
      socket.send(JSON.stringify(data));
    }
  };
  next();
};