import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

const file = "../data/db.sqlite";

export async function createConnection() : Promise<Database> {
	const db = await open({
		mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
		filename: file,
		driver: sqlite3.Database,
		
	});

	await ensureTablesExist(db);

	return db;
}

export const ensureTablesExist = async(connection : Database) => {
	if(!await tableExists(connection, "user")) {
		await connection.exec(`
		CREATE TABLE IF NOT EXISTS user (
			username TEXT PRIMARY KEY NOT NULL,
			password TEXT NOT NULL,
			created_at INTEGER NOT NULL
		);`);
	}
	if(!await tableExists(connection, "token")) {
		await connection.exec(`
		CREATE TABLE IF NOT EXISTS token (
			user TEXT NOT NULL,
			session_token TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			expires_at INTEGER NOT NULL,
			FOREIGN KEY (user) REFERENCES user(username),
			PRIMARY KEY (session_token)
		);`);
	}
}

async function tableExists(db : Database, table: string) : Promise<boolean> {
	return !!(await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name=?", table));
}