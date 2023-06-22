import { createConnection } from "./db";
import { Logger } from "./logger";
import type { User } from "./model/user";
import type { Database } from "sqlite";

export class UserService {
	public static async insert(username: string, password: string): Promise<boolean> {
		let connection: Database | undefined;
		try {
			connection = await createConnection();
			let date: number = Date.now();

			const stmt = await connection.prepare(`INSERT INTO user (username, password, created_at) VALUES (?, ?, ?)`, {
				1: username,
				2: password,
				3: date
			});

			let result = await stmt.run();
			await stmt.finalize();

			if (!result.changes || result.changes < 1) {
				Logger.error(`UserService: Failed to insert user ${username}`);
				return false;
			}
		} finally {
			connection?.close();
		}

		Logger.info(`UserService: Inserted user ${username}`);
		return true;
	}

	public static async getAll(): Promise<User[]> {
		let connection: Database | undefined;
		let users: User[] = [];
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(`SELECT username, password, created_at FROM user`);
			users = await stmt.all<User[]>();
			await stmt.finalize();
		} finally {
			connection?.close();
		}

		Logger.info(`UserService: Retrieved ${users?.length} users`);
		return users;
	}

	public static async getByUsername(username: string): Promise<User | undefined> {
		let connection: Database | undefined;
		let user: User | undefined;
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(`SELECT username, password, created_at FROM user WHERE username = ?`, {
				1: username
			});
			user = await stmt.get<User | undefined>();
			await stmt.finalize();
		} finally {
			connection?.close();
		}

		Logger.info(`UserService: Retrieved user ${user?.username}`);
		return user;
	}
}
