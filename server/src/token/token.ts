import { User } from "../user/user";

export interface Token {
    user: string;
    token: string;
    created_at: number;
    expires_at: number;
}