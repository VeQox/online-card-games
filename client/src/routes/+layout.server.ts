import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load : LayoutServerLoad = async ({ request, cookies, fetch }) => {
    const session = cookies.get("session");

    if(request.url === "/") {
        return;
    }

    if(!session){
        throw redirect(301, "/auth/register");
    }

    const response = await fetch("http://localhost:3000/auth/validate-session", {
        method: "GET",
        headers: {
            "Authorization": session
        }
    });

    if(response.ok){
        return {
            session: session
        }
    }

    cookies.delete("session");
    throw redirect(301, "/auth/login");
}