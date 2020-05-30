import { useDispatch } from "react-redux";
import { useReduxState } from "./useReduxState";
import { useCallback } from "react";
import { registerAddress, unregisterAddress } from "../modules/server";

export const useServerConnection = () => {
  const dispatch = useDispatch();
  const serverAddress = useReduxState((state) => state.server.serverAddress);

  const connect = useCallback(async () => {
    const serverAddress = window.prompt("server address");
    if (!serverAddress) throw new Error("server address not found");
    dispatch(registerAddress(serverAddress));
    return serverAddress;
  }, [dispatch]);

  const disconnect = useCallback(async () => {
    dispatch(unregisterAddress());
  }, [dispatch]);

  return {
    serverAddress,
    connect,
    disconnect,
  };
};
