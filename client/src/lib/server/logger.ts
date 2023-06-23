import { appendFile } from "fs";
import { join } from "path";

export class Logger {
	private static logFile = join(process.cwd(), "../data/logs/", `log-${new Date().toISOString()}.log`);

	private static write(message: string): void {
		console.log(message);
		appendFile(this.logFile, `${message}\n`, (err) => {
			if (err) console.log("Log failed");
		});
	}

	public static info(message: string): void {
		this.write(`[INFO]  ${message}`);
	}

	public static error(message: string): void {
		this.write(`[ERROR] ${message}`);
	}

	public static debug(message: string): void {
		this.write(`[DEBUG] ${message}`);
	}
}
