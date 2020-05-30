import { Codec, GetInterface } from "purify-ts";
import { RangedLengthString } from "../utils/codec";

export type UserCreateRequest = GetInterface<typeof UserCreateRequest>;
export const UserCreateRequest = Codec.interface({
  name: RangedLengthString({ gt: 0, lte: 30 }),
});
