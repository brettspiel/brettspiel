import { useReduxState } from "./useReduxState";
import { useServerConnection } from "./useServerConnection";
import { useHistory } from "react-router";
import { paths } from "../paths";
import { User } from "../types/domain/User";

export const useLoggedInEffect = (): {
  self: User;
  serverId: string;
  serverAddress: string;
} => {
  const history = useHistory();
  const { serverId, serverAddress } = useServerConnection();
  const self = useReduxState((state) => state.user.self);

  if (!serverId || !serverAddress) {
    history.push(paths["/"].routingPath);
  }
  if (!self) {
    history.push(paths["/login"].routingPath);
  }

  return {
    self: self!,
    serverId: serverId!,
    serverAddress: serverAddress!,
  };
};
