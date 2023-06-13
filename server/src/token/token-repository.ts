import { Logger } from "../logger/logger";
import { Database } from "sqlite";
import { createConnection } from "../db/db";
import { Token } from "./token";
import { randomBytes } from "crypto";

export class TokenRepository {
    static TOKEN_EXPIRATION_TIME : number = 1000 * 60 * 60 * 2; // 2 hour
    
    public static generateToken() : string {
        return randomBytes(64).toString("base64");
    }

    public static async insert(token : string, username : string) : Promise<boolean> {
        let connection: Database | undefined;
        try {
            connection = await createConnection();
            let date : number = Date.now();

            const stmt = await connection.prepare(`INSERT INTO token (token, username, created_at, expires_at) VALUES (?, ?, ?, ?)`, {
                1: token,
                2: username,
                3: date,
                4: date + this.TOKEN_EXPIRATION_TIME
            });

            let result = await stmt.run();
            await stmt.finalize();

            if(result.changes < 1){
                Logger.error(`Failed to insert token ${token}`);
                connection.close();
                return false;
            }

            Logger.info(`Inserted token ${token}`);
        } finally {
            connection.close();
        }
        return true;
    }

    public static async update(token : string) : Promise<boolean> {
        let connection: Database | undefined;
        try {
            connection = await createConnection();
            let date : number = Date.now();

            const stmt = await connection.prepare(`UPDATE token SET expires_at = ? WHERE token = ?`, {
                1: date + this.TOKEN_EXPIRATION_TIME,
                2: token
            });

            let result = await stmt.run();
            await stmt.finalize();

            if(result.changes < 1){
                Logger.error(`Failed to update token ${token}`);
                connection.close();
                return false;
            }

            Logger.info(`Updated token ${token}`);
        } finally {
            connection.close();
        }
        return true;
    }

    public static async delete(token : string | undefined) : Promise<boolean> {
        if(!token) return false;
        
        let connection: Database | undefined;
        try {
            connection = await createConnection();

            const stmt = await connection.prepare(`DELETE FROM token WHERE token = ?`, {
                1: token
            });

            let result = await stmt.run();
            await stmt.finalize();

            if(result.changes < 1){
                Logger.error(`Failed to delete token ${token}`);
                connection.close();
                return false;
            }

            Logger.info(`Deleted token ${token}`);
        } finally {
            connection.close();
        }
        return true;
    }

    public static async getAll() : Promise<Token[]> {
        let connection: Database | undefined;
        let tokens : Token[] = [];
        try {
            connection = await createConnection();
            const stmt = await connection.prepare(`SELECT token, user, created_at, expires_at FROM token`);
            tokens = await stmt.get<Token[]>();
            await stmt.finalize();
        } finally {
            connection.close();
        }
        return tokens;
    }

    public static async getByUser(username : string) : Promise<Token | undefined> {
        let connection: Database | undefined;
        let token : Token | undefined;
        try {
            connection = await createConnection();
            const stmt = await connection.prepare(`SELECT token, user, created_at, expires_at FROM token WHERE user = '?'`, {
                1: username
            });
            token = await stmt.get<Token | undefined>();
            await stmt.finalize();
        } finally {
            connection.close();
        }
        return token;
    }
}