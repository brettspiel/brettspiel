import { ChatLog } from "@brettspiel/domain-types/lib/ChatLog";
import { User } from "@brettspiel/domain-types/lib/User";

type ChatStoreInternal = {
  logs: ChatLog[];
};

export class ChatStore {
  private store: ChatStoreInternal = { logs: [] };

  insert = (user: User, message: string): ChatLog => {
    const log: ChatLog = {
      timestamp: Date.now(),
      user,
      message,
    };

    this.store.logs.push(log);

    return log;
  };

  get = (size: number): ChatLog[] => {
    return this.store.logs.slice(Math.max(0, this.store.logs.length - size));
  };
}

export const loungeChatStore = new ChatStore();
