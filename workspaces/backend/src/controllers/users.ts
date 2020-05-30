import { Router } from "express";
import { EitherAsync } from "purify-ts";
import { UserCreateRequest } from "../types/io/UserCreateRequest";
import { UsersCreateResponse } from "../types/io/UsersCreateResponse";
import { ErrorResponse } from "../types/io/ErrorResponse";
import { userStore } from "../stores/UserStore";

export const usersRoute = Router();

usersRoute.post<any, UsersCreateResponse | ErrorResponse, any, any>(
  "/users",
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
