import { Router } from "express";
import { ErrorResponse } from "@brettspiel/io-types/lib/rest/ErrorResponse";
import { GameRoomListResponse } from "@brettspiel/io-types/lib/rest/GameRoomListResponse";
import { gameRoomStore } from "../stores/GameRoomStore";

export const gameRoomsRoute = Router();

gameRoomsRoute.get<any, GameRoomListResponse | ErrorResponse, any, any>(
  "/",
  (req, res) => {
    const rooms = gameRoomStore.list({ statuses: ["wanted", "started"] });

    res.send({
      rooms,
    });
  }
);
