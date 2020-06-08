import { Codec, GetInterface } from "purify-ts";
import {
  RegExpMatchedString,
  StringLengthRangedIn,
} from "purify-ts-extra-codec";

export type User = GetInterface<typeof User>;
export const User = Codec.interface({
  id: RegExpMatchedString(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  ),
  name: StringLengthRangedIn({ gt: 0, lte: 30 }),
});
