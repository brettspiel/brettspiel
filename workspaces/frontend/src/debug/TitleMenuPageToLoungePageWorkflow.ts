import { store } from "../store";
import { registerAddress } from "../modules/server";
import { createUser } from "../modules/user";
import { paths } from "../paths";
import { DEBUG_MODE } from "../constants";
import { history } from "../history";
import { read } from "clipboardy";

export class TitleMenuPageToLoungePageWorkflow {
  private dispatch = store.dispatch;

  run = async () => {
    if (!DEBUG_MODE) return;

    const serverAddress = await read();
    if (!serverAddress) return;

    await this.dispatch(registerAddress(serverAddress));
    await this.dispatch(createUser("BotUser"));
    history.push(paths["/"].routingPath);
  };
}
