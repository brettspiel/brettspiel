import { loungeChatStore } from "../stores/ChatStore";
import { ServerSocket } from "@brettspiel/typed-socket/lib/ServerSocket";
import { User } from "@brettspiel/domain-types/lib/User";
import { gameRoomStore } from "../stores/GameRoomStore";

export const loungeSocket = (socketEvent: ServerSocket, user: User) => {
  socketEvent.requestOn("request/lounge/rooms", () => gameRoomStore.list());

  socketEvent.on("client/lounge/chatSend", (value) => {
    const log = loungeChatStore.insert(value.user, value.message);

    socketEvent.emit("server/lounge/chatLog", log); // emit to self
    socketEvent.broadcast?.emit("server/lounge/chatLog", log); // emit to others
  });

  socketEvent.on("client/lounge/openRoom", (type) => {
    gameRoomStore.create(type, user);
    const rooms = gameRoomStore.list();

    socketEvent.emit("server/lounge/roomStatusChange", rooms);
    socketEvent.broadcast?.emit("server/lounge/roomStatusChange", rooms);
  });
};
