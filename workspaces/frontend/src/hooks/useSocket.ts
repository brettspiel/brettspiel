import useWebSocket from "react-use-websocket";
import { useLoggedIn } from "../features/LoggedInRoute";

export const useSocket = (path: string) => {
  const { serverAddress, secretToken } = useLoggedIn();
  const url = new URL(serverAddress);
  url.protocol = "wss";
  url.pathname = path;

  return useWebSocket(url.toString(), { protocols: secretToken });
};
