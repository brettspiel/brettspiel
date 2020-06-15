import { DEBUG_MODE } from "../constants";
import { store } from "../store";

export class LoungePageSendChatWorkflow {
  constructor(private emit: any) {}

  run = async () => {
    if (!DEBUG_MODE) return;

    setInterval(() => {
      this.emit("client/lounge/chatSend", {
        user: store.getState().user.self!,
        message: Math.random().toString(),
      });
    }, 10 * 1000);
  };
}
