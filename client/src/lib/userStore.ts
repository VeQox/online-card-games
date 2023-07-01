import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { User } from "$lib/types/user";
import { v4 } from "uuid";

export const user = writable<User>(new User("Guest", v4()));

const setUser = () => {
    let storedUser = User.fromJSON(localStorage.getItem("user") as string);
    if(storedUser) {
        if(!storedUser.id) storedUser.id = v4();
        user.set(storedUser);
        localStorage.setItem("user", storedUser.toJSON());
        return;
    }
}

// load user from localStorage
if(browser) {
    setUser();
    user.subscribe(val => {
        if(!val) return;
        localStorage.setItem("user", val.toJSON());
    });
}