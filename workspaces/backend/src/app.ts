import express from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";
import { usersRoute } from "./controllers/users";
import { loungeSocket } from "./controllers/loungeSocket";
import { TypedSocketEvent } from "./TypedSocketEvent";

const app = express();
export const server = http.createServer(app);
const io = socketIo(server, {
  handlePreflightRequest: (req: any, res: any) => {
    const headers = {
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-user-id, x-secret-token",
      "Access-Control-Allow-Origin": req.headers.origin,
      "Access-Control-Allow-Credentials": true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});

app.use(express.json());
app.use(cors());

app.use(healthcheckRoute);
app.use(usersRoute);

io.of("/lounge").on("connection", (socket) =>
  loungeSocket(new TypedSocketEvent(socket))
);
