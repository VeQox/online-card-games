import { Logger } from "$lib/server/logger";
import { TokenService } from "$lib/server/token-service";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
export const load: LayoutServerLoad = async ({ request, cookies, fetch }) => {
	Logger.info(`${request.method} on ${request.url}`);

	const session = cookies.get("session");

	if (!session || session === "") {
		return;
	}

	console.log("session found");
	if (!(await TokenService.validate(session))) {
		cookies.set("session", "", { httpOnly: true, secure: false, path: "/", expires: new Date(0) });
		throw redirect(303, "/auth/login");
	}
};
