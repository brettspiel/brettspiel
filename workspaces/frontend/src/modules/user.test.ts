import "jest";
import { join, leave, user as reducer, UserState } from "./user";
import { User } from "../types/User";

const createDefaultContext = () => {
  const initialState: UserState = { users: [] };
  const user = User.unsafeDecode({
    id: "00000000-0000-0000-0000-000000000000",
    name: "alice",
  });

  return {
    initialState,
    user,
  };
};

describe("user", () => {
  describe("join", () => {
    it("should add user to state", () => {
      const { initialState, user } = createDefaultContext();

      expect(reducer(initialState, join(user))).toEqual({ users: [user] });
    });
  });

  describe("leave", () => {
    it("should remove user from state", () => {
      const { user } = createDefaultContext();
      const initialState: UserState = {
        users: [user],
      };

      expect(reducer(initialState, leave(user))).toEqual({ users: [] });
    });
  });
});
