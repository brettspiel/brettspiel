import { Codec, GetInterface, optional, string, unknown } from "purify-ts";
import { JsonFromString } from "purify-ts-extra-codec";

export type SocketMessage = GetInterface<typeof SocketMessage>;
export const SocketMessage = JsonFromString(
  Codec.interface({
    type: string,
    payload: optional(unknown),
  })
);
