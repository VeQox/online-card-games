import { writable } from "svelte/store";

interface User {
    name: string;
    id?: string;
}

export const user = writable<User>({ name: "Guest" });