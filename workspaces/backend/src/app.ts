import express from "express";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";
import { usersRoute } from "./controllers/users";
import ExpressWs from "express-ws";
import { withSocketAuth } from "./middlewares/withSocketAuth";
import { User } from "@brettspiel/domain-types/lib/User";
import { withSocketBroadcaster } from "./middlewares/withSocketBroadcaster";
import { loungeSocket } from "./controllers/loungeSocket";
import { ticTacToe } from "./controllers/gameSocket/ticTacToe";
import { gamesRoute } from "./controllers/gamesRoute";

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
app.use("/games/:gameType", gamesRoute);

app.ws("/lounge/chat", withSocketAuth, withSocketBroadcaster(), loungeSocket);
app.ws("/game/tic-tac-toe", withSocketAuth, withSocketBroadcaster(), ticTacToe);
