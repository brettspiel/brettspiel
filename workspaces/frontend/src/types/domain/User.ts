import { Codec, GetInterface } from "purify-ts";
import { RangedLengthString, UuidV4 } from "../utils/codec";

export type User = GetInterface<typeof User>;
export const User = Codec.interface({
  id: UuidV4,
  name: RangedLengthString({ gt: 0, lte: 30 }),
});
