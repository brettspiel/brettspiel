import { TypedSocketEvent } from "../TypedSocketEvent";
import { loungeChatStore } from "../stores/ChatStore";

export const loungeSocket = (socketEvent: TypedSocketEvent) => {
  socketEvent.on("client/lounge/chatSend", (value) => {
    const log = loungeChatStore.insert(value.user, value.message);

    socketEvent.emit("server/lounge/chatLog", log); // emit to self
    socketEvent.broadcast?.emit("server/lounge/chatLog", log); // emit to others
  });
};
