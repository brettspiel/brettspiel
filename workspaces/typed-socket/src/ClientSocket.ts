import io from "socket.io-client";
import { SocketEvent, SocketEventType } from "./SocketEvent";

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
