import { writable } from "svelte/store";

export const token_name = writable({
    token: "",
    is_user_active: false,
    is_admin: false,
});
