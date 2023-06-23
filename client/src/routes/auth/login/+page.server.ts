import { createConnection } from "$lib/server/db";
import { Logger } from "$lib/server/logger";
import { TokenService } from "$lib/server/token-service";
import { UserService } from "$lib/server/user-service";
import { digestMessage } from "$lib/utils";
import { redirect, fail } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import type { Database } from "sqlite";
import { DEV } from "$env/static/private";

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();

		const username = formData.get("username") as string;
		const password = await digestMessage(formData.get("password") as string);

		let connection: undefined | Database;
		try {
			connection = await createConnection();

			let user = await UserService.getByUsername(username);
			if (!user) {
				Logger.info(`Login: No User found with ${username}`);
				return fail(400, { message: `No User found with ${username}` });
			}
			if (password !== user.password) {
				Logger.info(`Login: Incorrect Password`);
				return fail(400, { message: "Incorrect Password" });
			}
			let token = await TokenService.getByUser(username);
			if (token) await TokenService.delete(token);
			let session = TokenService.generateSessionToken();
			if (!(await TokenService.insert(session, username))) return fail(500, { message: "Internal server error" });

			cookies.set("session", session, {
				httpOnly: false,
				sameSite: "strict",
				secure: DEV === "false",
				path: "/"
			});
			Logger.info(`Login: User ${username} logged in successfully`);
		} finally {
			connection?.close();
		}

		Logger.info(`Login: Redirecting to /`);
		throw redirect(303, "/");
	}
};
