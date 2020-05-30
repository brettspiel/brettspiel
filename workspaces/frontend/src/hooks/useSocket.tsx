import React, { createContext, useCallback, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { SocketEvent, SocketEventType } from "../types/io/SocketEvent";

export type SocketContextValue = {
  socket?: typeof Socket;
};

export const SocketContext = createContext<SocketContextValue>({});
export const SocketProvider: React.FunctionComponent = ({ children }) => {
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export const useSocket = (serverAddress: string, namespace?: string) => {
  const ctx = useContext(SocketContext);

  const isConnected = !!ctx.socket?.connected;

  const connect = useCallback(() => {
    if (!isConnected) {
      const address = namespace
        ? `${serverAddress}${namespace}`
        : serverAddress;
      ctx.socket = io(address);
    }
  }, [isConnected, namespace, serverAddress, ctx.socket]);

  const disconnect = useCallback(() => {
    if (ctx.socket) {
      ctx.socket.disconnect();
    }
  }, [ctx.socket]);

  const emit = useCallback(
    <T extends SocketEventType>(type: T, value: SocketEvent[T]) => {
      if (ctx.socket) {
        ctx.socket.emit(type, value);
      }
    },
    [ctx.socket]
  );

  const subscribe = useCallback(
    <T extends SocketEventType>(
      type: T,
      subscriber: (value: SocketEvent[T]) => void
    ) => {
      if (ctx.socket) {
        ctx.socket.on(type, subscriber);
      }
    },
    [ctx.socket]
  );

  const unsubscribe = useCallback(
    <T extends SocketEventType>(
      type: T,
      subscriber: (value: SocketEvent[T]) => void
    ) => {
      if (ctx.socket) {
        ctx.socket.off(type, subscriber);
      }
    },
    [ctx.socket]
  );

  return {
    isConnected,
    connect,
    disconnect,
    emit,
    subscribe,
    unsubscribe,
  };
};
