import { store } from "../store";
import { registerId } from "../modules/server";
import { createUser } from "../modules/user";
import { paths } from "../paths";
import { DEBUG_MODE } from "../constants";
import { history } from "../history";

export class TitleMenuPageToLoungePageWorkflow {
  private dispatch = store.dispatch;

  run = async () => {
    if (!DEBUG_MODE) return;

    const serverId = window.prompt("server id");
    if (!serverId) return;

    await this.dispatch(registerId(serverId));
    await this.dispatch(createUser("BotUser"));
    history.push(paths["/lounge"].routingPath);
  };
}
