import { Result } from "./client";
import { ApiError } from "./ApiError";
import { JsonValidationError } from "./JsonValidationError";
import { Either, Left } from "purify-ts/Either";
import { Codec } from "purify-ts/Codec";

export type ApiClientError = JsonValidationError | ApiError;

export type ResultLike<P> = {
  controller: AbortController;
  promise: () => Promise<P>;
};

export const decodeResult = <T>(
  result: Result<unknown>,
  ResultCodec: Codec<T>
): ResultLike<Either<ApiClientError, T>> =>
  mapPromise(result, (value) =>
    (value as Either<ApiClientError, T>).chain((v) =>
      ResultCodec.decode(v).chainLeft((reason) =>
        Left(new JsonValidationError(reason))
      )
    )
  );

const mapPromise = <T, P>(
  { promise, ...rest }: Result<T>,
  pipe: (v: Either<ApiError, T>) => P
): ResultLike<P> => ({
  ...rest,
  promise: () => promise().then(pipe),
});
