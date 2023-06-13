import { Database, Statement } from "sqlite";
import { createConnection } from "../db/db";
import { User } from "./user";
import { Logger } from "../logger/logger";

export class UserRepository {
	public static async insert(username : string, password : string) : Promise<boolean> {
		let connection: Database | undefined;
		try {
			connection = await createConnection();
            let date : number = Date.now();

			const stmt = await connection.prepare(`INSERT INTO user (username, password, created_at) VALUES (?, ?, ?)`, {
                1: username,
                2: password,
                3: date
            });

            let result = await stmt.run();
            await stmt.finalize();

            if(result.changes < 1){
                Logger.error(`Failed to insert user ${username}`);
                connection.close();
                return false;
            }

            Logger.info(`Inserted user ${username}`);
		} finally {
			connection.close();
		}

        return true;
	}

    public static async getAll() : Promise<User[]> {
        let connection: Database | undefined;
        let users : User[] = [];
        try {
            connection = await createConnection();
            const stmt = await connection.prepare(`SELECT id, username, password, created_at FROM user`);
            users = await stmt.get<User[]>();
            await stmt.finalize();
        } finally {
            connection.close();
        }
        return users;
    }

    public static async getByUsername(username : string) : Promise<User | undefined> {
        let connection: Database | undefined;
        let user : User | undefined;
        try {
            connection = await createConnection();
            const stmt = await connection.prepare(`SELECT username, password, created_at FROM user WHERE username = '?'`, {
                1: username
            });
            user = await stmt.get<User | undefined>();
            await stmt.finalize();
        } finally {
            connection.close();
        }
        return user;
    }
}
