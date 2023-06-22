import { randomBytes } from "crypto";
import type { Database } from "sqlite";
import { createConnection } from "./db";
import type { Token } from "./model/token";
import { Logger } from "./logger";

export class TokenService {
	static TOKEN_EXPIRATION_TIME: number = 1000 * 60 * 15; // 15 minutes

	public static generateSessionToken(): string {
		let token = randomBytes(64).toString("base64");
		Logger.info(`TokenService: Generated new session token ${token}`);
		return token;
	}

	public static async insert(session: string, username: string): Promise<boolean> {
		let connection: Database | undefined;
		try {
			connection = await createConnection();
			let date: number = Date.now();

			const stmt = await connection.prepare(`INSERT INTO token (session_token, user, created_at, expires_at) VALUES (?, ?, ?, ?)`);
			await stmt.bind({
				1: session,
				2: username,
				3: date,
				4: date + this.TOKEN_EXPIRATION_TIME
			});

			let result = await stmt.run();
			await stmt.finalize();

			if (!result.changes || result.changes < 1) {
				return false;
			}
		} finally {
			connection?.close();
		}

		Logger.info(`TokenService: Inserted token for user ${username}`);
		return true;
	}

	public static async update(token: Token): Promise<boolean>;
	public static async update(session: string): Promise<boolean>;
	public static async update(param: Token | string): Promise<boolean> {
		let session = "";
		if (typeof param === "string") session = param;
		else session = param.session_token;

		let connection: Database | undefined;
		try {
			connection = await createConnection();
			
			const stmt = await connection.prepare(`UPDATE token SET expires_at = ? WHERE session_token = ?`);
			await stmt.bind({
				1: Date.now() + this.TOKEN_EXPIRATION_TIME,
				2: session
			});

			let result = await stmt.run();
			await stmt.finalize();

			if (!result.changes || result.changes < 1) {
				connection.close();
				return false;
			}
		} finally {
			connection?.close();
		}

		Logger.info(`TokenService: Updated token ${session}`);
		return true;
	}

	public static async delete(token: Token): Promise<boolean>;
	public static async delete(session: string): Promise<boolean>;
	public static async delete(session: string | Token): Promise<boolean> {
		if (!session) return false;

		let connection: Database | undefined;
		try {
			connection = await createConnection();

			const stmt = await connection.prepare(`DELETE FROM token WHERE session_token = ?`);
			await stmt.bind({
				1: session
			});

			let result = await stmt.run();
			await stmt.finalize();

			if (!result.changes || result.changes < 1) {
				return false;
			}
		} finally {
			connection?.close();
		}

		Logger.info(`TokenService: Removed token ${session}`);
		return true;
	}

	public static async getAll(): Promise<Token[]> {
		let connection: Database | undefined;
		let tokens: Token[] | undefined = [];
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(`SELECT session_token, user, created_at, expires_at FROM token`);
			tokens = await stmt.get<Token[] | undefined>();
			await stmt.finalize();
		} finally {
			connection?.close();
		}

		Logger.info(`TokenService: Retrieved ${tokens?.length} tokens`);
		return tokens ?? [];
	}

	public static async getByUser(username: string): Promise<Token | undefined> {
		let connection: Database | undefined;
		let token: Token | undefined;
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(`SELECT session_token, user, created_at, expires_at FROM token WHERE user = ?`);
			await stmt.bind({
				1: username
			});
			token = await stmt.get<Token | undefined>();
			await stmt.finalize();
		} finally {
			connection?.close();
		}

		Logger.info(`TokenService: Retrieved ${token?.session_token} token`);
		return token;
	}

	public static async get(session: string): Promise<Token | undefined> {
		let connection: Database | undefined;
		let token: Token | undefined;
		try {
			connection = await createConnection();
			const stmt = await connection.prepare(`SELECT session_token, user, created_at, expires_at FROM token WHERE session_token = ?`);
			await stmt.bind({
				1: session
			});

			token = await stmt.get<Token | undefined>();
			await stmt.finalize();
		} finally {
			connection?.close();
		}

		Logger.info(`TokenService: Retrieved ${token?.session_token} token`);
		return token;
	}

	public static async validate(session: string) : Promise<boolean> {
		let token = await this.get(session);
		if(!token) return false;

		if(token.expires_at > Date.now()) {
			this.update(token);
			Logger.info(`TokenService: Token ${token.session_token} validated`);
			return true;
		}

		Logger.info(`TokenService: Token ${token.session_token} expired`);
		return false;
	}	
}
