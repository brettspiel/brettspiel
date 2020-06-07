import { useReduxState } from "./useReduxState";
import { useServerConnection } from "./useServerConnection";
import { useHistory } from "react-router";
import { paths } from "../paths";
import { User } from "../types/domain/User";

export const useLoggedInEffect = (): {
  self: User;
  serverAddress: string;
} => {
  const history = useHistory();
  const { serverAddress } = useServerConnection();
  const self = useReduxState((state) => state.user.self);

  if (!serverAddress || !self) {
    history.push(paths["/login"].routingPath);
  }

  return {
    self: self!,
    serverAddress: serverAddress!,
  };
};
