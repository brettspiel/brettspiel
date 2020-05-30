import { Codec, GetInterface, number } from "purify-ts";
import { User } from "./User";
import { RangedLengthString } from "../utils/codec";

export type ChatLog = GetInterface<typeof ChatLog>;
export const ChatLog = Codec.interface({
  timestamp: number,
  user: User,
  message: RangedLengthString({ gt: 0, lte: 400 }),
});
