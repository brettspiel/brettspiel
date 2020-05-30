import { assertUnreachable } from "@brettspiel/utils/lib/language";

type AB = "A" | "B";

export const greeter = (ab: AB) => {
  switch (ab) {
    case "A": {
      console.log("Hello world");
      break;
    }
    case "B": {
      console.log("Hello world");
      break;
    }
    default: {
      assertUnreachable(ab);
    }
  }
};

greeter("A");
