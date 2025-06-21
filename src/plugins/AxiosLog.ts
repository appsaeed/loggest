/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel, Plugin } from "../types.js";

export class AxiosLog implements Plugin {
	//
	constructor(private options: { url: string }) {}

	async log(level: LogLevel, ctx: Record<string, any>, message: any, ...op: any[]): Promise<void> {
		const axios = (await import("axios")).default;
		await axios.post(this.options.url, { level, ctx, message, op });
	}
}

export default AxiosLog;
