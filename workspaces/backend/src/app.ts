import express from "express";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";
import { usersRoute } from "./controllers/users";
import ExpressWs from "express-ws";
import { withSocketAuth } from "./middlewares/withSocketAuth";
import { User } from "@brettspiel/domain-types/lib/User";
import { SocketMessage } from "@brettspiel/io-types/lib/socket/SocketMessage";
import { withSocketBroadcaster } from "./middlewares/withSocketBroadcaster";

declare global {
  export namespace Express {
    export interface Request {
      user?: User;
      broadcast: (data: SocketMessage) => void;
    }
  }
}

export const { app } = ExpressWs(express());

app.use(express.json());
app.use(cors());

app.use("/__healthcheck", healthcheckRoute);
app.use("/users", usersRoute);

app.ws("/echo", withSocketAuth, withSocketBroadcaster, (ws, req) => {
  ws.on("message", (message) => {
    req.broadcast({
      type: "message",
      payload: `Hello ${req.user?.name}. ${message}`,
    });
  });
});

app.ws("/lounge", withSocketAuth, withSocketBroadcaster, (ws, req) => {
  ws.on("message", (message) => {
    req.broadcast({
      type: "message",
      payload: `Hello ${req.user?.name}. ${message}`,
    });
  });
});
