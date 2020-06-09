import { loungeChatStore } from "../stores/ChatStore";
import { ServerSocket } from "@brettspiel/typed-socket/lib/ServerSocket";
import { GameRoom } from "@brettspiel/domain-types/lib/GameRoom";

export const loungeSocket = (socketEvent: ServerSocket) => {
  socketEvent.on("client/lounge/chatSend", (value) => {
    const log = loungeChatStore.insert(value.user, value.message);

    socketEvent.emit("server/lounge/chatLog", log); // emit to self
    socketEvent.broadcast?.emit("server/lounge/chatLog", log); // emit to others
  });

  socketEvent.on("client/lounge/openRoom", (type) => {
    const room: GameRoom = {
      type,
      status: "wanted",
      host: undefined,
      players: undefined,
    };

    socketEvent.emit("server/lounge/roomStatusChange", room);
    socketEvent.broadcast?.emit("server/lounge/roomStatusChange", room);
  });
};
