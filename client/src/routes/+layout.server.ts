import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { TokenService } from "$lib/server/token-service";
import { Logger } from "$lib/server/logger";
export const load: LayoutServerLoad = async ({ request, cookies, fetch }) => {
    Logger.info(`${request.method} on ${request.url}`);

	const session = cookies.get("session");

	if (!session) {
        return;
	}

    console.log("session found")
    if (!(await TokenService.validate(session))) {
        cookies.delete("session");
        throw redirect(303, "/auth/login");
    }
};