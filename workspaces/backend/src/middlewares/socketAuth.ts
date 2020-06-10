import { Socket } from "socket.io";
import { userStore } from "../stores/UserStore";
import { User } from "@brettspiel/domain-types/lib/User";

export const socketAuth = (next: (socket: Socket, user: User) => void) => (
  socket: Socket
) => {
  const userData = userStore.get(socket.handshake.headers["x-user-id"]);
  if (!userData) return socket.disconnect();

  const isAuthenticated =
    userData.secretToken === socket.handshake.headers["x-secret-token"];
  if (!isAuthenticated) return socket.disconnect();

  next(socket, userData.user);
};
