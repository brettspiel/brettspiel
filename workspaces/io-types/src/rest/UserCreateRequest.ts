import { Codec, GetInterface } from "purify-ts";
import { StringLengthRangedIn } from "purify-ts-extra-codec";

export type UserCreateRequest = GetInterface<typeof UserCreateRequest>;
export const UserCreateRequest = Codec.interface({
  name: StringLengthRangedIn({ gt: 0, lte: 30 }),
});
