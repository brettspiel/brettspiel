import { Codec, GetInterface, number } from "purify-ts";
import { User } from "./User";
import { StringLengthRangedIn } from "purify-ts-extra-codec";

export type ChatLog = GetInterface<typeof ChatLog>;
export const ChatLog = Codec.interface({
  timestamp: number,
  user: User,
  message: StringLengthRangedIn({ gt: 0, lte: 400 }),
});
