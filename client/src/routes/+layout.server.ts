import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { TokenService } from "$lib/server/token-service";
export const load: LayoutServerLoad = async ({ request, cookies, fetch }) => {

	const session = cookies.get("session");

    console.log(`Session: ${session}`)

	if (!session) {
        console.log("no session found")
        return;
	}

    console.log("session found")
    if (!(await TokenService.validate(session))) {
        cookies.delete("session");
        throw redirect(303, "/auth/login");
    }
};