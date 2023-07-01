import { createServer, Server } from "http";
import express, { Express } from "express";
import { roomRouter } from "./router/room-router";
import { RoomRepository } from "./repository/room-repository";
import cors from "cors";

const app: Express = express();
const server: Server = createServer(app);

app.use(express.json());
app.use(cors());
app.use("/rooms", roomRouter);

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});