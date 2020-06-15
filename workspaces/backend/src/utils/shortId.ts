import base62 from "base62";

export const generateShortId = (): string => {
  return base62.encode(Math.floor(Math.random() * 1e18));
};
