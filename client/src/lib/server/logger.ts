import { appendFile } from "fs";
import { join } from "path";

export class Logger {
	private static logFile = join(process.cwd(), "../data/logs/", `log-${new Date().toISOString()}.log`)

	private static write(message: string): void {
		appendFile(this.logFile, message, (err) => {
			if(err) console.log("Log failed");
		});
	}

	public static info(message: string): void {
		this.write(`[INFO]  ${message}\n`);
	}

	public static error(message: string): void {
		this.write(`[ERROR] ${message}\n`);
	}

	public static debug(message: string): void {
		this.write(`[DEBUG] ${message}\n`);
	}
}
