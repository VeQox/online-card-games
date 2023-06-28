import { IncomingMessage } from "http";
import { WebSocketServer } from "ws";

export class Room extends WebSocketServer {
    constructor() {
        super({ noServer: true });

        this.on("connection", this.onConnection);
        this.on("listening", this.onListening);
    }

    private onConnection(socket: WebSocket, request : IncomingMessage) {
        console.log("New connection from", request.socket.remoteAddress);
    }

    private onListening() {
        console.log("Room is listening");
    }
}