import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useServerConnection } from "../hooks/useServerConnection";
import { useReduxState } from "../hooks/useReduxState";
import { paths } from "../paths";
import { User } from "@brettspiel/domain-types/lib/User";

type LoggedInContextValue = {
  self: User;
  secretToken: string;
  serverAddress: string;
};

const LoggedInContext = React.createContext<LoggedInContextValue>(null as any);

export const LoggedInRoute: React.FunctionComponent<RouteProps> = (props) => {
  const { serverAddress } = useServerConnection();
  const self = useReduxState((state) => state.user.self);
  const secretToken = useReduxState((state) => state.user.secretToken);
  if (!serverAddress || !self || !secretToken) {
    return <Redirect to={paths["/login"].routingPath} />;
  }

  return (
    <LoggedInContext.Provider value={{ self, secretToken, serverAddress }}>
      <Route {...props} />
    </LoggedInContext.Provider>
  );
};

export const useLoggedIn = () => {
  const value = useContext(LoggedInContext);
  if (!value)
    throw new Error(
      `useLoggedIn hooks must used under LoggedInRoute component`
    );
  return value;
};
