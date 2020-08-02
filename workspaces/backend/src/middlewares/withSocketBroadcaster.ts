import { WebsocketRequestHandler } from "express-ws";
import WebSocket from "ws";

export const withSocketBroadcaster = (): WebsocketRequestHandler => {
  const sockets = new Map<string, WebSocket>();

  return (ws, req, next) => {
    if (!req.user)
      throw new Error(
        `withSocketBroadcaster must be used in authorized socket context.`
      );

    sockets.set(req.user.id, ws);
    ws.on("close", () => {
      if (!req.user) throw new Error(`Unexpected user request mutation.`);
      sockets.delete(req.user.id);
    });

    req.broadcast = (data: unknown) => {
      for (const socket of sockets.values()) {
        socket.send(data);
      }
    };
    next();
  };
};
