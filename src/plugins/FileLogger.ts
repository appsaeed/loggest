/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs";
import * as path from "path";
import { LogLevel, Plugin } from "../types.js";

export class FileLogger implements Plugin {

	private filePath: string;
	private disabled: boolean;

	/**
	 * The plugin instance with options
	 */
	constructor(options: { path: string; disabled?: boolean }) {
		this.filePath = options.path;
		this.disabled = options.disabled || false;
	}

	/**
	 * Prepare the plugin initiate steps
	 * 
	 * The init will run at once per instance
	 */
	async init(): Promise<void> {

		if (this.disabled) return;

		await fs.mkdir(path.dirname(this.filePath), { recursive: true });

	}

	/**
	 * Store logs in file
	 */
	async handle(level: LogLevel, _: any, message: any, ...optional: unknown[]): Promise<void> {

		//avoid create log 
		if (this.disabled) return;

		const iosTime = new Date().toISOString();
		const optData = optional.length > 0 ? encodeJson(optional) : "";
		const content = encodeJson(message);
		const logLine = `${iosTime} [${level.toUpperCase()}] ${content} ${optData}\n`;

		await fs.appendFile(this.filePath, logLine);
	}

}

export default FileLogger;


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
