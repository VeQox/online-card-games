import { open } from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";
import { Logger } from "./logger";

const file = "../data/db.sqlite";

export async function createConnection(): Promise<Database> {
	const db = await open({
		mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
		filename: file,
		driver: sqlite3.Database
	});

	await ensureTablesExist(db);

	return db;
}

export const ensureTablesExist = async (connection: Database) => {
	if (!(await tableExists(connection, "user"))) {
		Logger.info("User table does not exist");
		await connection.exec(` 
		CREATE TABLE IF NOT EXISTS user (
			username TEXT PRIMARY KEY NOT NULL CHECK(length(username) > 0 AND length(username) < 256),
			password TEXT NOT NULL CHECK(length(password) = 64),
			created_at INTEGER NOT NULL
		);`);
		if (await tableExists(connection, "user")) Logger.info("User table created");
	}
	if (!(await tableExists(connection, "token"))) {
		Logger.info("Token table does not exist");
		await connection.exec(`
		CREATE TABLE IF NOT EXISTS token (
			user TEXT NOT NULL CHECK(length(user) > 0 AND length(user) < 256),
			session_token TEXT NOT NULL CHECK(length(session_token) = 88),
			created_at INTEGER NOT NULL CHECK(created_at > 0),
			expires_at INTEGER NOT NULL CHECK(expires_at > created_at),
			FOREIGN KEY (user) REFERENCES user(username),
			PRIMARY KEY (session_token)
		);`);
		if (await tableExists(connection, "token")) Logger.info("User table created");
	}
};

async function tableExists(db: Database, table: string): Promise<boolean> {
	return !!(await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name=?", table));
}
