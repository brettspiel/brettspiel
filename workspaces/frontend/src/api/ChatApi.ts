import { createClient } from "../api-client";
import AbortControllerOriginal from "abort-controller";

export class ChatApi {
  private clients: ReturnType<typeof createClient>;
  constructor(
    private serverAddress: string,
    private fetch = window.fetch.bind(window),
    private AbortController = AbortControllerOriginal
  ) {
    this.clients = createClient(serverAddress, fetch, AbortController);
  }

  send = (text: string) => {
    this.clients.apiPost("/chat", {}, { text }).promise().catch();
  };
}
