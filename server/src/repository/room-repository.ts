import { GameType } from "../game";
import { Room } from "../room";
import { User } from "../user";

export class RoomRepository {

    private static CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static MAX_ROOM_COUNT = Math.sqrt(Math.pow(4, this.CHARS.length));

    private static rooms: Map<string, Room> = new Map();

    private static add(room: Room) {
        this.rooms.set(room.id, room);
    }

    private static exists(id: string) {
        return this.rooms.has(id);
    }

    public static get(id: string) {
        return this.rooms.get(id);
    }

    public static all(){
        return Array.from(this.rooms.values());
    }

    private static remove(id: string) {
        this.rooms.delete(id);
    }

    public static create(user: User, type: GameType, pub: boolean = false, name?: string) {
        let id = this.generateId();
        if(!id) return;

        name = name ?? `${user.name}'s room`;
        let room = new Room(id, name, user, pub, type);

        let cleanup = setInterval(() => {
            if(room.users.length != 0) return;

            this.remove(room.id);
            clearInterval(cleanup);
        }, 1000 * 60); // 1 minute

        this.add(room);
        return room;
    }

    private static generateId(length : number = 4) {
        if(this.rooms.size === this.MAX_ROOM_COUNT) return;

        let id;
        do {
            id = "";
            for (let i = 0; i < length; i++) {
                id += this.CHARS[Math.floor(Math.random() * this.CHARS.length)];
            }
        } while(this.exists(id));

        return id;
    }
}