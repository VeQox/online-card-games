import { open, Database } from "sqlite";
import { Database as Driver } from "sqlite3";

const file = "data/db.sqlite";

export async function createConnection() : Promise<Database> {
	const db = await open({
		filename: file,
		driver: Driver
	});

	await ensureTablesExist(db);

	return db;
}

const ensureTablesExist = async(connection : Database) => {
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
			token TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			expires_at INTEGER NOT NULL,
			FOREIGN KEY (user) REFERENCES user(username),
			PRIMARY KEY (token)
		);`);
	}
}

async function tableExists(db : Database, table: string) : Promise<boolean> {
	
	return !!(await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name=?", table));
}