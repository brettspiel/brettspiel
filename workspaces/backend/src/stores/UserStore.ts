import { User } from "../types/domain/User";
import { v4 } from "uuid";
import { generateShortId } from "../utils/shortId";

type UserStoreInternal = {
  [id: string]: {
    user: User;
    secretToken: string;
  };
};

export class UserStore {
  private store: UserStoreInternal = {};

  insert = (name: string): { user: User; secretToken: string } => {
    const user: User = {
      id: v4(),
      name,
    };
    const secretToken = generateShortId();

    const result = {
      user,
      secretToken,
    };
    this.store[user.id] = result;

    return result;
  };

  delete = (id: string): void => {
    delete this.store[id];
  };
}

export const userStore = new UserStore();
