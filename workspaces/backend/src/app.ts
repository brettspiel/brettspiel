import express from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";
import { healthcheckRoute } from "./controllers/healthcheck";

const app = express();
export const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

app.use(healthcheckRoute);
