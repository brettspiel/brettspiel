import { WebsocketRequestHandler } from "express-ws";
import { userStore } from "../stores/UserStore";
import { string } from "purify-ts";

export const withSocketAuth: WebsocketRequestHandler = (ws, req, next) => {
  const secretToken = string.decode(req.header("sec-websocket-protocol"));
  if (secretToken.isLeft()) return ws.close(401);

  const userData = userStore.getBySecretToken(secretToken.unsafeCoerce());
  if (!userData) return ws.close(401);

  req.user = userData.user;
  next();
};
