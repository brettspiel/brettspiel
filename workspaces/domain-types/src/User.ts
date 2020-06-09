import { Codec, GetInterface } from "purify-ts";
import { NonEmptyString, StringLengthRangedIn } from "purify-ts-extra-codec";

export type User = GetInterface<typeof User>;
export const User = Codec.interface({
  id: NonEmptyString,
  name: StringLengthRangedIn({ gt: 0, lte: 30 }),
});
