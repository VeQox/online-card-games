import { createConnection } from "$lib/server/db";
import { TokenService } from "$lib/server/token-service";
import { UserService } from "$lib/server/user-service";
import { digestMessage } from "$lib/utils";
import { redirect, fail } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import type { Database } from "sqlite";

export const actions: Actions = {
	default: async ({ cookies, request, fetch }) => {
		const formData = await request.formData();

		const username = formData.get("username") as string;
		const password = await digestMessage(formData.get("password") as string);

		let connection: undefined | Database;
		try {
			connection = await createConnection();

			let user = await UserService.getByUsername(username);
			if (!user) return fail(400, { message: `No User found with ${username}` });
			if (password !== user.password) return fail(400, { message: "Incorrect Password" });
			let token = await TokenService.getByUser(username);
			if (token) await TokenService.delete(token);
			let session = TokenService.generateSessionToken();
			if (!(await TokenService.insert(session, username))) return fail(500, { message: "Internal server error" });

			cookies.set("session", session, {
				httpOnly: true,
				sameSite: "strict",
				//secure: true,
				path: "/"
			});
		} finally {
			connection?.close();
		}

		throw redirect(303, "/");
	}
};
