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
		//filter log level to only support allow logs level
		if (!this.levels.includes(level)) return;

		// Kee and context separate for filter & format
		const ctx = this.context || {};

		if (this.filter && !this.filter(level, ctx, message, ...optional)) return;

		const formatted = this.format ? this.format(level, ctx, message, ...optional) : message;

		await Promise.all(this.plugins.map((p) => p.handle(level, ctx, formatted, ...optional)));
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
