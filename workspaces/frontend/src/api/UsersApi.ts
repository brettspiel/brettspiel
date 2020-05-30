import { createClient, decodeResult } from "../api-client";
import AbortControllerOriginal from "abort-controller";
import { UserCreateRequest } from "../types/io/UserCreateRequest";
import { unknown } from "purify-ts";
import { UsersCreateResponse } from "../types/io/UsersCreateResponse";

export class UsersApi {
  private clients: ReturnType<typeof createClient>;
  constructor(
    private serverUrl: string,
    private fetch = window.fetch.bind(window),
    private AbortController = AbortControllerOriginal
  ) {
    this.clients = createClient(serverUrl, fetch, AbortController);
  }

  create = (body: UserCreateRequest) =>
    decodeResult(this.clients.apiPost("/users", {}, body), UsersCreateResponse);

  destroy = (id: string) =>
    decodeResult(this.clients.apiDelete(`/users/${id}`), unknown);
}
