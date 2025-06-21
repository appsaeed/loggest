/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel, Plugin } from "../types.js";

interface FetchLogOptions {
	url: string;
	method?: "get" | "post" | "put" | "delete" | "petch";
	headers?: Record<string, string>; // Optional custom headers
}

export class ApiLog implements Plugin {
	//
	constructor(private options: FetchLogOptions) {}

	async log(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> {
		await fetch(this.options.url, {
			method: this.options?.method?.toUpperCase() || "POST",
			headers: {
				"Content-Type": "application/json",
				...(this.options.headers || {}),
			},
			body: JSON.stringify({ level, message, optional }),
		});
	}
}

export default ApiLog;
