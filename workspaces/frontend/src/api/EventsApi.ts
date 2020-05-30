export class EventsApi {
  private source?: EventSource;
  private onEvent?: (event: MessageEvent) => void;
  constructor(private serverAddress: string) {}

  connect = (userId: string, onEvent: (event: MessageEvent) => void) => {
    this.onEvent = onEvent;
    this.source = new EventSource(`${this.serverAddress}/events/${userId}`);
    this.source.addEventListener("message", this.onEvent);
  };

  disconnect = () => {
    if (this.source && this.onEvent) {
      this.source.removeEventListener("message", this.onEvent);
      this.source.close();
    }
  };
}
