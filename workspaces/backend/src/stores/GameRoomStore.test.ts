import "jest";
import { GameRoomStore } from "./GameRoomStore";
import { GameRoom } from "@brettspiel/domain-types/lib/GameRoom";
import { v4 } from "uuid";
import { User } from "@brettspiel/domain-types/lib/User";

const createDefaultContext = () => {
  const store = new GameRoomStore();
  const users: User[] = [
    {
      id: v4(),
      name: "Alice",
    },
    {
      id: v4(),
      name: "Bob",
    },
  ];
  const rooms: GameRoom[] = [
    {
      id: v4(),
      type: "Hex",
      status: "started",
      host: users[0],
      players: users,
    },
    {
      id: v4(),
      type: "TicTacToe",
      status: "wanted",
      host: users[1],
      players: users,
    },
  ];

  store["store"].rooms = rooms;

  return {
    store,
    users,
    rooms,
  };
};

describe("GameRoomStore", () => {
  describe("list", () => {
    it("should return all rooms", () => {
      const { store, rooms } = createDefaultContext();
      expect(store.list()).toEqual(rooms);
    });

    it("should return rooms that filtered by type", () => {
      const { store, rooms } = createDefaultContext();
      expect(store.list({ type: "Hex" })).toEqual([rooms[0]]);
    });

    it("should return rooms that filtered by status", () => {
      const { store, rooms } = createDefaultContext();
      expect(store.list({ statuses: ["started"] })).toEqual([rooms[0]]);
    });

    it("should return rooms that filtered by hostId", () => {
      const { store, users, rooms } = createDefaultContext();
      expect(store.list({ hostId: users[0].id })).toEqual([rooms[0]]);
    });

    it("should return rooms that filtered by playerId", () => {
      const { store, users, rooms } = createDefaultContext();
      expect(store.list({ playerIds: [users[0].id] })).toEqual(rooms);
    });
  });

  describe("create", () => {
    it("should return created GameRoom", () => {
      const { store, users } = createDefaultContext();
      expect(store.create("Hex", users[0])).toEqual({
        id: expect.any(String),
        type: "Hex",
        status: "wanted",
        host: users[0],
        players: [users[0]],
      });
    });
  });
});
