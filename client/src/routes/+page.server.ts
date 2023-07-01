import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { User } from "$lib/types/user";
import type { Room } from "$lib/types/room";

export const load : PageServerLoad = async({cookies, locals}) => {
    const response = await fetch("http://localhost:3000/rooms/?public=true", {
        method: "GET"
    });

    const rooms = await response.json() as Room[];

    return {
        rooms: rooms
    }
}