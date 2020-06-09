import { Result } from "./client";
import { Either, Left } from "purify-ts/Either";
import { Codec } from "purify-ts/Codec";
import { ApiClientError, MalformedResponseError } from "./Errors";

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
        Left(new MalformedResponseError(reason))
      )
    )
  );

const mapPromise = <T, P>(
  { promise, ...rest }: Result<T>,
  pipe: (v: Either<ApiClientError, T>) => P
): ResultLike<P> => ({
  ...rest,
  promise: () => promise().then(pipe),
});
