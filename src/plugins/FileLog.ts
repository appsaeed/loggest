import { promises as fs } from "fs";
import * as path from "path";
import { LogLevel, Plugin } from "../types.js";

export class FileLog implements Plugin {
	//
	private filePath: string;

	constructor(options: { path: string }) {
		this.filePath = options.path;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async log(level: LogLevel, _: Record<string, unknown>, message: any, ...optional: unknown[]): Promise<void> {
		const iosTime = new Date().toISOString();
		const optData = optional.length > 0 ? encodeJson(optional) : "";
		const content = encodeJson(message);
		const logLine = `${iosTime} [${level.toUpperCase()}] ${content} ${optData}\n`;
		await fs.mkdir(path.dirname(this.filePath), { recursive: true });
		await fs.appendFile(this.filePath, logLine);
	}
}

export default FileLog;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encodeJson(obj: any): string {
	//
	if (typeof obj === "string") return obj;

	const seen = new WeakSet();

	return JSON.stringify(obj, (_, value) => {
		//
		if (value instanceof Date) return value.toISOString();

		if (value instanceof Buffer) return value.toString("base64");

		if (value instanceof Set) return Array.from(value);

		if (typeof value === "bigint") value.toString();

		if (typeof value === "bigint") return value.toString() + "n";

		if (typeof value === "symbol") return `[Symbol: ${value.toString()}]`;

		if (typeof value === "function") return `[Function: ${value.name || "anonymous"}]`;

		if (typeof value === "object" && value !== null) {
			//
			if (seen.has(value)) return "[Circular]";

			seen.add(value);
		}

		return value;
	});
}
