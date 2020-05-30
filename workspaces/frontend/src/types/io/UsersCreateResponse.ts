import { Codec, GetInterface } from "purify-ts";
import { User } from "../domain/User";
import { NonEmptyString } from "../utils/codec";

export type UsersCreateResponse = GetInterface<typeof UsersCreateResponse>;
export const UsersCreateResponse = Codec.interface({
  user: User,
  secretToken: NonEmptyString,
});
