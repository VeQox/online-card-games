import { Database } from "sqlite";
import { createConnection } from "../db/db";
import { Token } from "./token";
import { randomBytes } from "crypto";

export class TokenRepository {
	static TOKEN_EXPIRATION_TIME: number = 1000 * 60 * 60 * 2; // 2 hour

	public static generateSessionToken(): string {
		return randomBytes(64).toString("base64");
	}

	public static async insert(
		sessionToken: string,
		username: string,
	): Promise<boolean> {
		let connection: Database | undefined;
		try {
			connection = await createConnection();
			let date: number = Date.now();

			const stmt = await connection.prepare(
				`INSERT INTO token (session_token, user, created_at, expires_at) VALUES (?, ?, ?, ?)`,
			);
			stmt.bind({
				1: sessionToken,
				2: username,
				3: date,
				4: date + this.TOKEN_EXPIRATION_TIME,
			});

			let result = await stmt.run();
			await stmt.finalize();

			if (result.changes < 1) {
				connection.close();
				return false;
			}
		} finally {
			connection.close();
		}
		return true;
	}

	public static async update(sessionToken: string): Promise<boolean> {
		let connection: Database | undefined;
		try {
			connection = await createConnection();
			let date: number = Date.now();

			const stmt = await connection.prepare(
				`UPDATE token SET expires_at = ? WHERE session_token = ?`,
			);
			stmt.bind({
				1: date + this.TOKEN_EXPIRATION_TIME,
				2: sessionToken,
			});

			let result = await stmt.run();
			await stmt.finalize();

			if (result.changes < 1) {
				connection.close();
				return false;
			}
		} finally {
			connection.close();
		}
		return true;
	}

	public static async delete(sessionToken: string | undefined): Promise<boolean> {
		if (!sessionToken) return false;

		let connection: Database | undefined;
		try {
			connection = await createConnection();

			const stmt = await connection.prepare(
				`DELETE FROM token WHERE session_token = ?`,
			);
			stmt.bind({
				1: sessionToken,
			});

			let result = await stmt.run();
			await stmt.finalize();

			if (result.changes < 1) {
				connection.close();
				return false;
			}
		} finally {
			connection.close();
		}
		return true;
	}

	public static async getAll(): Promise<Token[]> {
		let connection: Database | undefined;
		let tokens: Token[] = [];
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(
				`SELECT session_token, user, created_at, expires_at FROM token`,
			);
			tokens = await stmt.get<Token[]>();
			await stmt.finalize();
		} finally {
			connection.close();
		}
		return tokens;
	}

	public static async getByUser(
		username: string,
	): Promise<Token | undefined> {
		let connection: Database | undefined;
		let token: Token | undefined;
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(
				`SELECT session_token, user, created_at, expires_at FROM token WHERE user = '?'`,
			);
			stmt.bind({
				1: username,
			});
			token = await stmt.get<Token | undefined>();
			await stmt.finalize();
		} finally {
			connection.close();
		}
		return token;
	}

	public static async get(sessionToken: string): Promise<Token | undefined> {
		let connection: Database | undefined;
		let token: Token | undefined;
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(
				`SELECT session_token, user, created_at, expires_at FROM token WHERE session_token = ?`,
			);
			stmt.bind({
				1: sessionToken,
			});

			token = await stmt.get<Token | undefined>();
			await stmt.finalize();
		} finally {
			connection.close();
		}
		return token;
	}
}
