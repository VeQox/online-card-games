import { Router } from "express";
import { RoomRepository } from "../repository/room-repository";
import { User } from "../user";
import { GameType } from "../game";

export const roomRouter = Router();

roomRouter.post("/", ({ body }, res) => {
	let user = User.fromJSON(body.user);
	let type = body.type as GameType;
	let pub = Boolean(body.public);
	let name = body.name;
	const room = RoomRepository.create(user, type, pub, name);
	console.log(room);

	if (!room) {
		res.status(500).send();
		return;
	}

	res.status(201).json({
		id: room.id,
	});
});

roomRouter.get("/:id", ({ params }, res) => {
	if (isNaN(Number(params.id))) {
		res.status(400).send();
		return;
	}

	res.json(RoomRepository.get(params.id)?.toJSON());
});

roomRouter.get("/", (req, res) => {
	let rooms = RoomRepository.all();

	if (!req.query.public || !Boolean(req.query.public)) {
		res.status(200).json(rooms.map((room) => room.toJSON()));
		return;
	}

	let publicRooms = rooms.filter((room) => room.public);

	res.status(200).json(publicRooms.map((room) => room.toJSON()));
});