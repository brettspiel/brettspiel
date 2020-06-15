import express from "express";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";
import { usersRoute } from "./controllers/users";
import ExpressWs from "express-ws";

const { app } = ExpressWs(express());

app.use(express.json());
app.use(cors());

app.use("__healthcheck", healthcheckRoute);
app.use("/users", usersRoute);

app.ws("/lounge", (ws) => {
  ws.on("message", (message) => {
    ws.send(message);
  });
});
