import { RequestHandler } from "express";
import { EitherAsync } from "purify-ts";
import { GameType } from "@brettspiel/domain-types/lib/GameRoom";

export const gamesRoute: RequestHandler = (req, res) =>
  EitherAsync(async ({ liftEither }) => {
    const gameType = await liftEither(GameType.decode(req.params.gameType));
    console.log("@gameType", gameType);

    res.send({ url: "https://example.com" });
  }).run();
