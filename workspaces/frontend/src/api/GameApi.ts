import { createClient } from "@brettspiel/api-client/lib/client";
import AbortControllerOriginal from "abort-controller";
import { GameType } from "@brettspiel/domain-types/lib/GameRoom";
import { decodeResult } from "@brettspiel/api-client/lib/utils";
import { Codec, string } from "purify-ts";

export class GameApi {
  private clients: ReturnType<typeof createClient>;
  constructor(
    private serverAddress: string,
    private fetch = window.fetch.bind(window),
    private AbortController = AbortControllerOriginal
  ) {
    this.clients = createClient(serverAddress, fetch, AbortController);
  }

  createRoom = (gameType: GameType) => {
    decodeResult(
      this.clients.apiPut(`/games/${gameType}`),
      Codec.interface({ url: string })
    )
      .promise()
      .then(console.log);
  };
}
