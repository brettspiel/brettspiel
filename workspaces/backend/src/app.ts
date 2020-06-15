import express from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";
import { usersRoute } from "./controllers/users";
import { loungeSocket } from "./controllers/loungeSocket";
import { ServerSocket } from "@brettspiel/typed-socket/lib/ServerSocket";
import { socketIoPreflightRequestHandler } from "./middlewares/socketIoPreflightRequestHandler";
import { socketAuth } from "./middlewares/socketAuth";

const app = express();
export const server = http.createServer(app);
const io = socketIo(server, {
  handlePreflightRequest: socketIoPreflightRequestHandler,
});

app.use(express.json());
app.use(cors());

app.use("__healthcheck", healthcheckRoute);
app.use("/users", usersRoute);

io.of("/lounge").on(
  "connection",
  socketAuth((socket, user) => loungeSocket(new ServerSocket(socket), user))
);
