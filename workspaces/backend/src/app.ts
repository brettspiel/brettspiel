import express from "express";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";
import { usersRoute } from "./controllers/users";
import ExpressWs from "express-ws";
import { withSocketAuth } from "./middlewares/withSocketAuth";
import { User } from "@brettspiel/domain-types/lib/User";
import { SocketMessage } from "@brettspiel/io-types/lib/socket/SocketMessage";
import { withSocketBroadcaster } from "./middlewares/withSocketBroadcaster";
import { ChatLogSendRequest } from "@brettspiel/io-types/lib/socket/ChatLogSendRequest";
import { loungeChatStore } from "./stores/ChatStore";

declare global {
  export namespace Express {
    export interface Request {
      user?: User;
      broadcast: (data: unknown) => void;
    }
  }
}

export const { app } = ExpressWs(express());

app.use(express.json());
app.use(cors());

app.use("/__healthcheck", healthcheckRoute);
app.use("/users", usersRoute);

app.ws("/lounge/chat", withSocketAuth, withSocketBroadcaster, (ws, req) => {
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
});
