/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerOptions, LogLevel, Plugin } from "./types.js";

export class Logger {
	//
	private levels: LogLevel[] = ["info", "warn", "error", "debug"];

	private plugins: Plugin[];

	private format?: LoggerOptions["format"];

	private context?: LoggerOptions["context"];

	private filter?: LoggerOptions["filter"];

	constructor(options: LoggerOptions) {
		if (options.levels) this.levels = options.levels;
		this.plugins = options.plugins;
		this.format = options.format;
		this.context = options.context;
		this.filter = options.filter;

		// Initialize plugins
		this.init(options);
	}

	private async init(options: LoggerOptions) {
		await Promise.all(this.plugins.map((p) => p.init?.(options)));
	}

	private async logInternal(level: LogLevel, message: any, ...optional: any[]) {

		// check log level to only support allow logs level
		if (!this.levels.includes(level)) return;

		//get context to send into external
		const ctx = this.context || {};

		// 2. Early exit if a filter exists and blocks it
		if (this.filter && !this.filter(level, ctx, message, ...optional)) return;

		// 3. Format the log message only once
		const formatted = this.format ? this.format(level, ctx, message, ...optional) : message;

		// 4. Filter valid plugins once
		const plugins = this.plugins.filter((p) => !!p && typeof p.handle === "function");

		// 5. Run all plugin stages in parallel — before, handle, after
		await Promise.all(plugins.map(async (plugin) => {
			await plugin.before?.(level, ctx, formatted, ...optional);
			await plugin.handle(level, ctx, formatted, ...optional);
			await plugin.after?.(level, ctx, formatted, ...optional);
		}));

	}

	info(message: any, ...optional: any[]) {
		return this.logInternal("info", message, ...optional);
	}
	warn(message: any, ...optional: any[]) {
		return this.logInternal("warn", message, ...optional);
	}
	error(message: any, ...optional: any[]) {
		return this.logInternal("error", message, ...optional);
	}
	debug(message: any, ...optional: any[]) {
		return this.logInternal("debug", message, ...optional);
	}
	log(level: LogLevel, message: any, ...optional: any[]) {
		return this.logInternal(level, message, ...optional);
	}
}
export default Logger;
