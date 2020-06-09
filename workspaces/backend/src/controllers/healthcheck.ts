import { Router } from "express";

export const healthcheckRoute = Router();

healthcheckRoute.get("/", (_req, res) => {
  res.sendStatus(200);
});
