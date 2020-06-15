import express from "express";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";
import { usersRoute } from "./controllers/users";
import ExpressWs from "express-ws";
import { withSocketAuth } from "./middlewares/withSocketAuth";
import { User } from "@brettspiel/domain-types/lib/User";

declare global {
  export namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export const { app } = ExpressWs(express());

app.use(express.json());
app.use(cors());

app.use("/__healthcheck", healthcheckRoute);
app.use("/users", usersRoute);

app.ws("/echo", withSocketAuth, (ws, req) => {
  ws.on("message", (message) => {
    ws.send(`Hello ${req.user?.name}. ${message}`);
  });
});
