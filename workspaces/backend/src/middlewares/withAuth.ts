import { RequestHandler } from "express";
import { string } from "purify-ts";
import { userStore } from "../stores/UserStore";

export const withAuth: RequestHandler = (req, res, next) => {
  const userId = string.decode(req.header("x-user-id"));
  const secretToken = string.decode(req.header("x-secret-token"));

  if (userId.isLeft() || secretToken.isLeft()) return res.sendStatus(401);
  if (
    userStore.get(userId.unsafeCoerce())?.secretToken !==
    secretToken.unsafeCoerce()
  )
    return res.sendStatus(401);
  next();
};
