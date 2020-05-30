import { v4 } from "uuid";

export const generateShortId = (): string => {
  const id = v4().split("-").join("");
  return Buffer.from(id, "hex").toString("base64");
};
