import { Codec, GetInterface } from "purify-ts";
import { User } from "../domain/User";
import { RangedLengthString } from "../utils/codec";

export type ChatLogSendRequest = GetInterface<typeof ChatLogSendRequest>;
export const ChatLogSendRequest = Codec.interface({
  user: User,
  message: RangedLengthString({ gt: 0, lte: 400 }),
});
