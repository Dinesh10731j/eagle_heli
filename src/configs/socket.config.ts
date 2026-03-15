import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

export class SocketService {
  private io: Server;

  constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.initializeSocket();
  }

  private initializeSocket() {
    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  public getIO(): Server {
    return this.io;
  }
}