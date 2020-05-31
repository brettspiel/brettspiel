import { Launcher } from "./Launcher";
import { server } from "./app";
import portfinder from "portfinder";
import clipboardy from "clipboardy";

portfinder
  .getPortPromise()
  .then((port) => new Launcher(server).launch(port))
  .then((serverUrl) => {
    console.log(`Server launched at ${serverUrl}`);
    return clipboardy.write(serverUrl);
  })
  .catch(console.error);
