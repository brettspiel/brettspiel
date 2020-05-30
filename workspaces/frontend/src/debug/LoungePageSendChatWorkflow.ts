import { DEBUG_MODE } from "../constants";
import { store } from "../store";
import { useSocket } from "../hooks/useSocket";

export class LoungePageSendChatWorkflow {
  private dispatch = store.dispatch;
  constructor(private emit: ReturnType<typeof useSocket>["emit"]) {}

  run = async () => {
    if (!DEBUG_MODE) return;

    setInterval(() => {
      this.emit("client/lounge/chatSend", {
        user: store.getState().user.self!,
        message: Math.random().toString(),
      });
    }, 5000);
  };
}
