import { Server, createServer } from "http";
import { Room } from "./room";

const server: Server = createServer();

server.listen(3000, "0.0.0.0", 511, () => {
    console.log("Server is running on port 3000");
});


server.on("upgrade", (request, socket, head) => {
    let room = new Room();
    room.handleUpgrade(request, socket, head, () => {
        room.emit("connection", socket, request);
    });
});