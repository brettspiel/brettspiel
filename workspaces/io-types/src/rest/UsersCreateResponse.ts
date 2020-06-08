import { Codec, GetInterface } from "purify-ts";
import { NonEmptyString } from "purify-ts-extra-codec";
import { User } from "@brettspiel/domain-types/lib/User";

export type UsersCreateResponse = GetInterface<typeof UsersCreateResponse>;
export const UsersCreateResponse = Codec.interface({
  user: User,
  secretToken: NonEmptyString,
});
