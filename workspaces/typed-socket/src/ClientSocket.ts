import io from "socket.io-client";
import { SocketEvent, SocketEventType } from "./SocketEvent";
import { SocketRequest, SocketRequestType } from "./SocketRequest";

export type SocketAuth = {
  userId: string;
  secretToken: string;
};

export class ClientSocket {
  private readonly socket: typeof io.Socket;
  constructor(private url: string, private auth: SocketAuth) {
    this.socket = io(url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            "x-user-id": auth.userId,
            "x-secret-token": auth.secretToken,
          },
        },
      },
    });
  }

  get isConnected() {
    return this.socket.connected;
  }

  disconnect = () => this.socket.disconnect();

  request = <T extends SocketRequestType>(type: T, body: SocketRequest[T][0]) =>
    new Promise<SocketRequest[T][1]>((resolve) => {
      this.socket.emit(type, body);
      this.socket.emit(type, body); // FIXME: First time emit ignored ???
      this.socket.once(type + "/res", resolve);
    });

  emit = <T extends SocketEventType>(type: T, value: SocketEvent[T]) => {
    this.socket.emit(type, value);
  };

  on = <T extends SocketEventType>(
    type: T,
    listener: (value: SocketEvent[T]) => void
  ) => {
    this.socket.on(type, listener);
  };

  off = <T extends SocketEventType>(
    type: T,
    listener: (value: SocketEvent[T]) => void
  ) => {
    this.socket.off(type, listener);
  };
}
