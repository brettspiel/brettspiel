import { Codec, GetInterface } from "purify-ts";
import { StringLengthRangedIn } from "purify-ts-extra-codec";
import { User } from "@brettspiel/domain-types/lib/User";

export type ChatLogSendRequest = GetInterface<typeof ChatLogSendRequest>;
export const ChatLogSendRequest = Codec.interface({
  user: User,
  message: StringLengthRangedIn({ gt: 0, lte: 400 }),
});
