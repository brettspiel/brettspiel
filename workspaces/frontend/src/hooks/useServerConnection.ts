import { useDispatch } from "react-redux";
import { useReduxState } from "./useReduxState";
import { useCallback } from "react";
import { registerId, unregisterId } from "../modules/server";
import { getServerAddress } from "../utils/serverAddress";

export const useServerConnection = () => {
  const dispatch = useDispatch();
  const serverId = useReduxState((state) => state.server.serverId);
  const serverAddress = serverId && getServerAddress(serverId);

  const connect = useCallback(async () => {
    const serverId = window.prompt("server id");
    if (!serverId) throw new Error("server id not found");
    dispatch(registerId(serverId));
    return serverId;
  }, [dispatch]);

  const disconnect = useCallback(async () => {
    dispatch(unregisterId());
  }, [dispatch]);

  return {
    serverId,
    serverAddress,
    connect,
    disconnect,
  };
};
