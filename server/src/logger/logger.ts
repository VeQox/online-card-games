import { createWriteStream } from "fs";
import { join } from "path";

export class Logger {
	private static writer = createWriteStream(
		join(
			process.cwd(),
			"data",
			"logs",
			`log-${new Date().toISOString()}.log`,
		),
		{
			flags: "w",
			encoding: "utf8",
		},
	);

	public static info(message: string): void {
		this.writer.write(`[INFO]  ${message}\n`);
	}

	public static error(message: string): void {
		this.writer.write(`[ERROR] ${message}\n`);
	}

	public static debug(message: string): void {
		this.writer.write(`[DEBUG] ${message}\n`);
	}
}
