import { WebSocket } from "ws";
import { Room } from "./room";

export class User {
    name: string;
    id: string;
    ws?: WebSocket;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }

    public static fromJSON(json: any) {
        return new User(json.name, json.id);
    }
}