import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  ClientSocket,
  SocketAuth,
} from "@brettspiel/typed-socket/lib/ClientSocket";
import {
  SocketEvent,
  SocketEventType,
} from "@brettspiel/typed-socket/lib/SocketEvent";
import {
  SocketRequest,
  SocketRequestType,
} from "@brettspiel/typed-socket/lib/SocketRequest";

export const SocketContext = createContext<
  MutableRefObject<ClientSocket | undefined>
>({ current: undefined });
export const SocketProvider: React.FunctionComponent = ({ children }) => {
  const socketClientRef = useRef<ClientSocket>();
  return (
    <SocketContext.Provider value={socketClientRef}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (
  serverAddress: string,
  namespace: string,
  auth: SocketAuth
) => {
  const ctx = useContext(SocketContext);

  const isConnected = ctx.current?.isConnected;

  const connect = useCallback(() => {
    if (!isConnected) {
      const address = namespace
        ? `${serverAddress}${namespace}`
        : serverAddress;

      ctx.current = new ClientSocket(address, auth);
    }
  }, [isConnected, namespace, serverAddress, ctx, auth]);

  const disconnect = useCallback(() => {
    ctx.current?.disconnect();
  }, [ctx]);

  const request = useCallback(
    async <T extends SocketRequestType>(type: T, body: SocketRequest[T][0]) => {
      return ctx.current?.request(type, body);
    },
    [ctx]
  );

  const emit = useCallback(
    <T extends SocketEventType>(type: T, value: SocketEvent[T]) => {
      ctx.current?.emit(type, value);
    },
    [ctx]
  );

  const subscribe = useCallback(
    <T extends SocketEventType>(
      type: T,
      subscriber: (value: SocketEvent[T]) => void
    ) => {
      ctx.current?.on(type, subscriber);
    },
    [ctx]
  );

  const unsubscribe = useCallback(
    <T extends SocketEventType>(
      type: T,
      subscriber: (value: SocketEvent[T]) => void
    ) => {
      ctx.current?.off(type, subscriber);
    },
    [ctx]
  );

  return {
    isConnected,
    connect,
    disconnect,
    request,
    emit,
    subscribe,
    unsubscribe,
  };
};
