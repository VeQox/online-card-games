import { redirect } from '@sveltejs/kit';

export const load = async ({ request, cookies, fetch }) => {
    const sessionToken : string | undefined = cookies.get("authorization");

    if(!sessionToken){
        throw redirect(301, "/auth/register");
    }

    const response = await fetch("http://localhost:3000/auth/validate-session", {
        method: "GET",
        headers: {
            "Authorization": sessionToken
        }
    });

    if(response.ok){
        return {
            sessionToken: sessionToken
        }
    }

    cookies.delete("authorization");
    throw redirect(301, "/auth/login");
}