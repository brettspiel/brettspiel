import { WebsocketRequestHandler } from "express-ws";
import { userStore } from "../stores/UserStore";

export const withSocketAuth: WebsocketRequestHandler = (ws, req, next) => {
  const secretToken = req.header("sec-websocket-protocol");
  if (!secretToken) return ws.close(401);

  const userData = userStore.getBySecretToken(secretToken);
  if (!userData) return ws.close(401);

  req.user = userData.user;
  next();
};
