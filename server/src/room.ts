import { IncomingMessage } from "http";
import { WebSocketServer } from "ws";
import { User } from "./user";
import { Game, GameType } from "./game";

export class Room extends WebSocketServer {

    admin: User;    
    id: string;
    name: string;
    users: User[];
    game: Game;
    public: boolean;

    constructor(id : string, name : string, admin: User, pub: boolean, type: GameType) {
        super({ noServer: true });
        super.on("connection", this.onConnection);
        super.on("listening", this.onListening);

        this.admin = admin;
        this.id = id;
        this.name = name;
        this.users = [];
        this.public = pub;
        this.game = new Game(type, this);
    }

    private onConnection(ws: WebSocket, request : IncomingMessage) {
        console.log("New connection from", request.socket.remoteAddress);
    }

    private onListening() {
        console.log("Room is online");
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            users: this.users.length,
            type: this.game.type,
        };
    }
}