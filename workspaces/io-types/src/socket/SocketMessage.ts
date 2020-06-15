import { Codec, GetInterface, optional, string, unknown } from "purify-ts";

export type SocketMessage = GetInterface<typeof SocketMessage>;
export const SocketMessage = Codec.interface({
  type: string,
  payload: optional(unknown),
});
