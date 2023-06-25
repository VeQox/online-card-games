import { DEV } from "$env/static/private";
import { createConnection } from "$lib/server/db";
import { Logger } from "$lib/server/logger";
import { TokenService } from "$lib/server/token-service";
import { UserService } from "$lib/server/user-service";
import { digestMessage } from "$lib/utils";
import type { Actions } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import type { Database } from "sqlite";

export const actions: Actions = {
	default: async ({ cookies, request, fetch }) => {
		const formData = await request.formData();

		const username = formData.get("username") as string;
		const password = await digestMessage(formData.get("password") as string);
		const confirmPassword = await digestMessage(formData.get("confirm password") as string);

		if (password != confirmPassword) {
			Logger.info(`Register: Passwords don't match`);
			return fail(400, { message: "The passwords don't match. Please enter the same password in both fields.", field: "cofirm password" });
		}

		let connection: undefined | Database;
		try {
			connection = await createConnection();

			if (await UserService.getByUsername(username)) {
				Logger.info(`Register: User with ${username} already exists`);
				return fail(400, { message: `The username you entered is already taken. Please choose a different username.`, field: "username" });
			}
			if (!(await UserService.insert(username, password))) return fail(500, { message: "Internal server error", field: "" });
			let session = TokenService.generateSessionToken();
			if (!(await TokenService.insert(session, username))) return fail(500, { message: "Internal server error", field: "" });

			cookies.set("session", session, {
				httpOnly: true,
				sameSite: "strict",
				secure: DEV === "false",
				path: "/"
			});
			Logger.info(`Register: User ${username} registered successfully`);
		} finally {
			connection?.close();
		}

		Logger.info(`Register: Redirecting to /`);
		throw redirect(303, "/");
	}
};
