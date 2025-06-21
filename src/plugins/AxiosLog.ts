/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { LogLevel, Plugin } from "../types.js";

export class AxiosLog implements Plugin {
	//
	constructor(private options: { url: string }) {}

	async handle(level: LogLevel, ctx: Record<string, any>, message: any, ...op: any[]): Promise<void> {
		await axios.post(this.options.url, { level, ctx, message, op });
	}
}

export default AxiosLog;
