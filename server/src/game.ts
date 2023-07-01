import { Room } from "./room";

export type GameType = "Poker" | "Thirty One" | "Oh Hell";

export class Game {
    type: GameType;
    room: Room;

    constructor(type: GameType, room: Room) {
        this.type = type;
        this.room = room;
    }
}