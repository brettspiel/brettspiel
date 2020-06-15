import { Server } from "http";
import ngrok from "ngrok";
import { Application } from "express";

export class Launcher {
  private server: Server | null = null;
  constructor(private app: Application) {}

  launch = async (port: number): Promise<string> => {
    this.server = this.app.listen(port);
    return ngrok.connect({ addr: port, region: "ap" });
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
