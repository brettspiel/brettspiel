import { RequestHandler } from "express";
import { string } from "purify-ts";
import { userStore } from "../stores/UserStore";

export const withAuth: RequestHandler = (req, res, next) => {
  const secretToken = string.decode(req.header("x-secret-token"));

  if (secretToken.isLeft()) return res.sendStatus(401);
  const userData = userStore.getBySecretToken(secretToken.unsafeCoerce());
  if (!userData) return res.sendStatus(401);

  req.user = userData.user;
  next();
};
