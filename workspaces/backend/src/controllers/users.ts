import { Router } from "express";
import { EitherAsync } from "purify-ts";
import { userStore } from "../stores/UserStore";
import { UsersCreateResponse } from "@brettspiel/io-types/lib/rest/UsersCreateResponse";
import { ErrorResponse } from "@brettspiel/io-types/lib/rest/ErrorResponse";
import { UserCreateRequest } from "@brettspiel/io-types/lib/rest/UserCreateRequest";

export const usersRoute = Router();

usersRoute.post<any, UsersCreateResponse | ErrorResponse, any, any>(
  "/",
  (req, res) => {
    EitherAsync<string, UsersCreateResponse>(async ({ liftEither }) => {
      const { name } = await liftEither(UserCreateRequest.decode(req.body));
      const result = userStore.insert(name);

      return {
        user: result.user,
        secretToken: result.secretToken,
      };
    })
      .run()
      .then((result) =>
        result.either(
          (error) => {
            res.status(400).send({ message: error }).end();
          },
          (responseBody) => {
            res.send(responseBody);
          }
        )
      );
  }
);
