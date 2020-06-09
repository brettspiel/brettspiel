import { GameRoom, GameType } from "@brettspiel/domain-types/lib/GameRoom";
import { v4 } from "uuid";
import { User } from "@brettspiel/domain-types/lib/User";
import { Either, Left, Right } from "purify-ts";
import ExtensibleCustomError from "extensible-custom-error";

export class GameRoomStoreError extends ExtensibleCustomError {}
export class RoomIdNotFoundError extends GameRoomStoreError {}
export class PlayerAlreadyJoinedToRoomError extends GameRoomStoreError {}
export class PlayerNotJoinedInRoomError extends GameRoomStoreError {}

type GameRoomStoreInternal = {
  rooms: GameRoom[];
};

export class GameRoomStore {
  private store: GameRoomStoreInternal = { rooms: [] };

  list = (
    conditions: {
      type?: GameType;
      statuses?: GameRoom["status"][];
      hostId?: string;
      playerIds?: string[];
    } = {}
  ): GameRoom[] =>
    this.store.rooms.filter(
      (room) =>
        (conditions.type != null ? room.type === conditions.type : true) &&
        (conditions.statuses != null
          ? conditions.statuses.includes(room.status)
          : true) &&
        (conditions.hostId != null
          ? room.host.id === conditions.hostId
          : true) &&
        (conditions.playerIds != null
          ? room.players.findIndex((p) =>
              conditions.playerIds!.includes(p.id)
            ) !== -1
          : true)
    );

  create = (type: GameType, host: User): GameRoom => {
    const room: GameRoom = {
      id: v4(),
      type,
      status: "wanted",
      host,
      players: [host],
    };

    this.store.rooms.push(room);

    return room;
  };

  updateStatus = (
    roomId: string,
    status: GameRoom["status"]
  ): Either<GameRoomStoreError, GameRoom> => {
    const index = this.store.rooms.findIndex((r) => r.id === roomId);
    if (index === -1) return Left(new RoomIdNotFoundError());

    this.store.rooms[index].status = status;

    return Right(this.store.rooms[index]);
  };

  updatePlayersAdd = (
    roomId: string,
    players: User[]
  ): Either<GameRoomStoreError, GameRoom> => {
    const index = this.store.rooms.findIndex((r) => r.id === roomId);
    if (index === -1) return Left(new RoomIdNotFoundError());
    if (
      players.some(
        (pl) => !!this.store.rooms[index].players.find((p) => p.id === pl.id)
      )
    )
      return Left(new PlayerAlreadyJoinedToRoomError());

    this.store.rooms[index].players = this.store.rooms[index].players.concat(
      players
    );

    return Right(this.store.rooms[index]);
  };

  updatePlayersDelete = (
    roomId: string,
    playerIds: string[]
  ): Either<GameRoomStoreError, GameRoom> => {
    const index = this.store.rooms.findIndex((r) => r.id === roomId);
    if (index === -1) return Left(new RoomIdNotFoundError());
    if (
      !playerIds.every((pid) =>
        this.store.rooms[index].players.find((p) => p.id === pid)
      )
    )
      return Left(new PlayerNotJoinedInRoomError());

    this.store.rooms[index].players = this.store.rooms[index].players.filter(
      (p) => !playerIds.includes(p.id)
    );

    return Right(this.store.rooms[index]);
  };
}

export const gameRoomStore = new GameRoomStore();
