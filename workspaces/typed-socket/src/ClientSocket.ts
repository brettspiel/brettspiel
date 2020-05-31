import io from "socket.io-client";
import { SocketEvent, SocketEventType } from "./SocketEvent";

export class ClientSocket {
  private socket: typeof io.Socket;
  constructor(private url: string) {
    this.socket = io(url);
  }

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
