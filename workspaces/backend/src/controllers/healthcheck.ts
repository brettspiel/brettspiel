import { Router } from "express";

export const healthcheckRoute = Router();

healthcheckRoute.get("/__healthcheck", (_req, res) => {
  res.sendStatus(200);
});
