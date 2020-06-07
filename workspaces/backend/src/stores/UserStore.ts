import { User } from "../types/domain/User";
import { v4 } from "uuid";
import { generateShortId } from "../utils/shortId";

export type UserData = {
  user: User;
  secretToken: string;
};

type UserStoreInternal = {
  [id: string]: UserData;
};

export class UserStore {
  private store: UserStoreInternal = {};

  get = (id: string): UserData | undefined => this.store[id];

  insert = (name: string): UserData => {
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
