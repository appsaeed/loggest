/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { LogLevel, Plugin } from "../types.js";

export default class AxiosPlugin implements Plugin {
	//
	constructor(private options: { url: string }) {}

	async log(level: LogLevel, ctx: Record<string, any>, message: any, ...op: any[]): Promise<void> {
		await axios.post(this.options.url, { level, ctx, message, op });
	}
}
