import AbortControllerOriginal from "abort-controller";
import { createClient } from "@brettspiel/api-client/lib/client";
import { decodeResult } from "@brettspiel/api-client/lib/utils";
import { GameRoomListResponse } from "@brettspiel/io-types/lib/rest/GameRoomListResponse";

export class GameRoomsApi {
  private readonly clients: ReturnType<typeof createClient>;
  constructor(
    private serverAddress: string,
    private auth: { userId: string; secretToken: string },
    private fetch = window.fetch.bind(window),
    private AbortController = AbortControllerOriginal
  ) {
    this.clients = createClient(serverAddress, fetch, AbortController);
  }

  list = () =>
    decodeResult(
      this.clients.apiGet(
        "/gameRooms",
        {},
        {
          "x-user-id": this.auth.userId,
          "x-secret-token": this.auth.secretToken,
        }
      ),
      GameRoomListResponse
    );
}
