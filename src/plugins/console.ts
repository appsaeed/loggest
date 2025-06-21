import { LogLevel, Plugin } from "../types.js";

export class ConsoleLog implements Plugin {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async log(level: LogLevel, ctx: Record<string, any>, message: any, ...op: any[]): Promise<void> {
		const colorMap = {
			info: "\x1b[36m", // cyan
			warn: "\x1b[33m", // yellow
			error: "\x1b[31m", // red
			debug: "\x1b[90m", // gray
		};
		console.log(`${colorMap[level] || ""} ${level.toString()}: `, message, ...op);
	}
}
