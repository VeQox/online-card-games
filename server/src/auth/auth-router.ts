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

	if (await UserRepository.getByUsername(data.username)) {
		res.status(400).send("User already exists");
		return;
	}
	
	if (!(await UserRepository.insert(data.username, data.password))) {
		res.status(500).send("Internal server error");
		return;
	}

	let sessionToken: string = TokenRepository.generateSessionToken();
	if (!(await TokenRepository.insert(sessionToken, data.username))) {
		res.status(500).send("Internal server error");
		return;
	}

	res.status(200).json({
		name: "authorization",
		value: sessionToken,
		options: {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
			path: "/"
		}
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

	await TokenRepository.delete((await TokenRepository.getByUser(data.username)).session_token);

	let sessionToken = TokenRepository.generateSessionToken();
	if (!TokenRepository.insert(sessionToken, data.username)) {
		res.status(500).send("Internal server error");
		return;
	}

	res.status(200).json({
		name: "authorization",
		value: sessionToken,
		options: {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
			path: "/"
		}
	});
});

authRouter.get("validate-session", async (req, res) => {
	if (!req.headers.authorization) {
		res.status(401).send();
		return;
	}

	let token = await TokenRepository.get(req.headers.authorization);
	if (!token || token.expires_at < Date.now()) {
		res.status(401).send();
		return;
	}

	res.status(200).send();
});

const parseBody = (body: any): { data?: { username: string; password: string }; error: boolean } => {
	if (!body) {
		return { error: true };
	}
	const { username, password } = body;
	if (!username || !password || typeof username !== "string" || typeof password !== "string") {
		return { error: true };
	}
	return { data: { username, password }, error: false };
};
