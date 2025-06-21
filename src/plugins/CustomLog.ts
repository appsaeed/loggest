/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel, Plugin } from "../types.js";

export class CustomLog implements Plugin {
	constructor(private callback: (level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]) => Promise<void>) {}

	async handle(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> {
		await this.callback(level, ctx, message, ...optional);
	}
}
export default CustomLog;
