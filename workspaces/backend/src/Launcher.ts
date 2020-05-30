import { Server } from "http";
import ngrok from "ngrok";

export class Launcher {
  private server: Server | null = null;
  constructor(private httpServer: Server) {}

  launch = async (port: number): Promise<string> => {
    this.server = this.httpServer.listen(port);
    return ngrok.connect(port);
  };

  stop = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (!this.server) return resolve();

      this.server
        .close(() => {
          this.server = null;
          resolve();
        })
        .on("error", reject);
    });
}
