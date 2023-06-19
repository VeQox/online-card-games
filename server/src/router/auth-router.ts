import { User } from "@db/model/user";
import { TokenService } from "@db/token-service";
import { UserService } from "@db/user-service";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
	const { data, error } = parseBody(req.body);
	if (error) {
		res.status(400).send("Invalid username or password");
		return;
	}

	if (await UserService.getByUsername(data.username)) {
		res.status(400).send("User already exists");
		return;
	}
	
	if (!(await UserService.insert(data.username, data.password))) {
		res.status(500).send("Internal server error");
		return;
	}

	let session: string = TokenService.generateSessionToken();
	if (!(await TokenService.insert(session, data.username))) {
		res.status(500).send("Internal server error");
		return;
	}

	res.status(200).json({
		name: "session",
		value: session,
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

	let user: User | undefined = await UserService.getByUsername(
		data.username,
	);

	if (!user) {
		res.status(404).send("User not found");
		return;
	}

	await TokenService.delete((await TokenService.getByUser(data.username)).session_token);

	let session = TokenService.generateSessionToken();
	if (!TokenService.insert(session, data.username)) {
		res.status(500).send("Internal server error");
		return;
	}

	res.status(200).json({
		name: "session",
		value: session,
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

	let token = await TokenService.get(req.headers.authorization);
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
