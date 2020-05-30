import { Codec, GetInterface } from "purify-ts";
import { NonEmptyString } from "../utils/codec";

export type ErrorResponse = GetInterface<typeof ErrorResponse>;
export const ErrorResponse = Codec.interface({
  message: NonEmptyString,
});
