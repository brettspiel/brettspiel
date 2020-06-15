import { Launcher } from "./Launcher";
import { app } from "./app";
import portfinder from "portfinder";
import clipboardy from "clipboardy";

portfinder
  .getPortPromise()
  .then((port) => new Launcher(app).launch(port))
  .then((serverUrl) => {
    console.log(`Server launched at ${serverUrl}`);

    return clipboardy.write(serverUrl);
  })
  .catch(console.error);
