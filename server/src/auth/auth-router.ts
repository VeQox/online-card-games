import { Router } from "express";
import { UserRepository } from "../user/user-repository";
import { User } from "../user/user";
import { TokenRepository } from "../token/token-repository";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
	const { data, error } = parseBody(req.body);
	if (error) {
		res.status(400).send("Invalid username or password");
		return;
	}

	if(await UserRepository.getByUsername(data.username)){
		res.status(400).send("User already exists");
		return;
	}

	if (!(await UserRepository.insert(data.username, data.password))) {
		res.status(500).send("Failed to insert user");
		return;
	}

	let token: string = TokenRepository.generateToken();
	if (!TokenRepository.insert(token, data.username)) {
		res.status(500).send("Failed to insert token");
		return;
	}

	res.status(200).json({
		token,
	});
});

authRouter.post("/login", async (req, res) => {
	const { data, error } = parseBody(req.body);
	if (error) {
		res.status(400).send("Invalid username or password");
		return;
	}

	let user: User | undefined = await UserRepository.getByUsername(
		data.username,
	);

	if (!user) {
		res.status(404).send("User not found");
		return;
	}

	await TokenRepository.delete((await TokenRepository.getByUser(data.username)).token);

	let token = TokenRepository.generateToken();
	if (!TokenRepository.insert(token, data.username)) {
		res.status(500).send("Failed to insert token");
		return;
	}

	res.status(200).json({
		token,
	});
});

const parseBody = (body: any): {
	data?: {
		username: string;
		password: string;
	}, error: boolean } => {
	if (!body) {
		return { error: true };
	}
	const { username, password } = body;
	if (
		!username ||
		!password ||
		typeof username !== "string" ||
		typeof password !== "string"
	) {
		return { error: true };
	}
	return { data: { username, password }, error: false };
};
