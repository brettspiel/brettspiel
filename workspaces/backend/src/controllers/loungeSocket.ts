import { loungeChatStore } from "../stores/ChatStore";
import { ServerSocket } from "@brettspiel/typed-socket/lib/ServerSocket";
import { GameRoom } from "@brettspiel/domain-types/lib/GameRoom";
import { v4 } from "uuid";
import { User } from "@brettspiel/domain-types/lib/User";

export const loungeSocket = (socketEvent: ServerSocket, user: User) => {
  socketEvent.on("client/lounge/chatSend", (value) => {
    const log = loungeChatStore.insert(value.user, value.message);

    socketEvent.emit("server/lounge/chatLog", log); // emit to self
    socketEvent.broadcast?.emit("server/lounge/chatLog", log); // emit to others
  });

  socketEvent.on("client/lounge/openRoom", (type) => {
    const room: GameRoom = {
      id: v4(),
      type,
      status: "wanted",
      host: user,
      players: [user],
    };

    socketEvent.emit("server/lounge/roomStatusChange", room);
    socketEvent.broadcast?.emit("server/lounge/roomStatusChange", room);
  });
};
