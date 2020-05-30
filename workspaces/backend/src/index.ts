import { Launcher } from "./Launcher";
import { server } from "./app";
import portfinder from "portfinder";

portfinder
  .getPortPromise()
  .then((port) => new Launcher(server).launch(port))
  .then((serverUrl) => {
    console.log(`Server launched at ${serverUrl}`);
  })
  .catch(console.error);
