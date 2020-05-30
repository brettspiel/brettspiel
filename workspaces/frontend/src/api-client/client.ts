import { Either, Left, Right } from "purify-ts/Either";
import {
  ApiError,
  ApiInvalidJsonError,
  ApiRequestAbortedError,
  ApiResponse4xxError,
  ApiResponse5xxError,
} from "./ApiError";
import { stringify } from "qs";
import OriginalAbortController from "abort-controller";

export type Result<T> = {
  controller: OriginalAbortController;
  promise: () => Promise<Either<ApiError, T>>;
};

export const createClient = (
  baseUrl: string,
  fetch: typeof window.fetch = window.fetch.bind(window),
  AbortController: typeof OriginalAbortController = OriginalAbortController
) => {
  const apiClient = <T>(path: string, init?: RequestInit): Result<T> => {
    const controller = new AbortController();
    const promise = async () => {
      return fetch(`${baseUrl}${path}`, {
        ...init,
        headers: init?.headers,
        signal: controller.signal,
      })
        .then(async (res) => {
          // status is 400
          if (Math.floor(res.status / 100) === 4)
            return Left<ApiError, T>(
              new ApiResponse4xxError(
                `responseBody(text)=[${await res.clone().text()}]`
              )
            );
          // status is 500
          if (Math.floor(res.status / 100) === 5)
            return Left<ApiError, T>(
              new ApiResponse5xxError(
                `responseBody(text)=[${await res.clone().text()}]`
              )
            );

          try {
            return Right<T, ApiError>(await res.clone().json());
          } catch (error) {
            return Left<ApiError, T>(
              new ApiInvalidJsonError(
                `responseBody(text)=[${await res.clone().text()}]`,
                error
              )
            );
          }
        })
        .catch((reason) => {
          if (reason.name === "AbortError")
            return Left<ApiError, T>(new ApiRequestAbortedError(path));
          throw reason;
        });
    };

    return {
      controller,
      promise,
    };
  };

  const apiGet = <T>(path: string, query?: {}, headers?: {}): Result<T> =>
    apiClient(`${path}${stringify(query, { addQueryPrefix: true })}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
    });

  const apiPost = <T>(
    path: string,
    query?: {},
    body?: {},
    headers?: {}
  ): Result<T> =>
    apiClient(`${path}${stringify(query, { addQueryPrefix: true })}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
      method: "POST",
      body: body && JSON.stringify(body),
    });

  const apiPut = <T>(
    path: string,
    query?: {},
    body?: {},
    headers?: {}
  ): Result<T> =>
    apiClient(`${path}${stringify(query, { addQueryPrefix: true })}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
      method: "PUT",
      body: body && JSON.stringify(body),
    });

  const apiDelete = <T>(
    path: string,
    query?: {},
    body?: {},
    headers?: {}
  ): Result<T> =>
    apiClient(`${path}${stringify(query, { addQueryPrefix: true })}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
      method: "DELETE",
      body: body && JSON.stringify(body),
    });

  return {
    apiClient,
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
  };
};
