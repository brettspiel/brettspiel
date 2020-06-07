import { useReduxState } from "./useReduxState";
import { useServerConnection } from "./useServerConnection";
import { useHistory } from "react-router";
import { paths } from "../paths";
import { User } from "../types/domain/User";

export const useLoggedInEffect = (): {
  self: User;
  serverAddress: string;
  secretToken: string;
} => {
  const history = useHistory();
  const { serverAddress } = useServerConnection();
  const self = useReduxState((state) => state.user.self);
  const secretToken = useReduxState((state) => state.user.secretToken);

  if (!serverAddress || !self || !secretToken) {
    history.push(paths["/login"].routingPath);
  }

  return {
    self: self!,
    secretToken: secretToken!,
    serverAddress: serverAddress!,
  };
};
