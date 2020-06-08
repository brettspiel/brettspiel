import { loungeChatStore } from "../stores/ChatStore";
import { ServerSocket } from "@brettspiel/typed-socket/lib/ServerSocket";

export const loungeSocket = (socketEvent: ServerSocket) => {
  socketEvent.on("client/lounge/chatSend", (value) => {
    const log = loungeChatStore.insert(value.user, value.message);

    socketEvent.emit("server/lounge/chatLog", log); // emit to self
    socketEvent.broadcast?.emit("server/lounge/chatLog", log); // emit to others
  });
};
