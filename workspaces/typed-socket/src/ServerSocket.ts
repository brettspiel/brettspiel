import { Socket } from "socket.io";
import { SocketEvent, SocketEventType } from "./SocketEvent";
import { SocketRequest, SocketRequestType } from "./SocketRequest";

export class ServerSocket {
  constructor(private socket: Socket, private isBroadcaster: boolean = false) {}

  public broadcast = this.isBroadcaster
    ? null
    : new ServerSocket(this.socket.broadcast, true);

  requestOn = <T extends SocketRequestType>(
    type: T,
    listener: (value: SocketRequest[T][0]) => SocketRequest[T][1]
  ) => {
    this.socket.on(type, (value) => {
      this.socket.emit(type + "/res", listener(value));
    });
  };

  emit = <T extends SocketEventType>(type: T, value: SocketEvent[T]) => {
    if (this.broadcast) {
      this.socket.broadcast.emit(type, value);
    } else {
      this.socket.emit(type, value);
    }
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
