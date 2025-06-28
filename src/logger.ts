/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerOptions, LogLevel, Plugin } from "./types.js";

export class Logger {

	/**
	 * allowed log levels for this logger instance.
	 */
	readonly #levels: LogLevel[] = ["info", "warn", "error", "debug"];

	/**
	 * List of plugins used to handle log messages
	 */
	readonly #plugins: Plugin[];

	/**
	 * Optional custom formatter for log message output.
	 */
	readonly #format?: LoggerOptions["format"];

	/**
	 * Optional shared context metadata for all log entries.
	 */
	readonly #context?: LoggerOptions["context"];

	/**
	 * Optional filter function to control which messages are logged.
	 */
	readonly #filter?: LoggerOptions["filter"];

	/**
	 * Create a new logger instance.
	 */
	constructor(options: LoggerOptions) {

		// apply custom log levels if provided
		if (options.levels) this.#levels = options.levels;

		this.#plugins = options.plugins;
		this.#format = options.format;
		this.#context = options.context;
		this.#filter = options.filter;

		// Initialize plugins with the logger options
		this.#init(options);
	}

	/**
	 * Initialize all registered plugins with the given options.
	 * 
	 * This function runs once per plugin for a single instance of the logger.
	 */
	async #init(options: LoggerOptions) {
		await Promise.all(this.#plugins.map((p) => p.init?.(options)));
	}

	/**
	 * Core logging handler for filtering and formatting entries to plugins.
	 * 
	 * This function runs per log call for all registered plugins.
	 */
	async #logInternal(level: LogLevel, message: any, ...optional: any[]) {

		// Skip if log level not support log levels
		if (!this.#levels.includes(level)) return;

		//get context to send into external
		const ctx = this.#context || {};

		// Skip if filter blocks this log 
		if (this.#filter && !this.#filter(level, ctx, message, ...optional)) return;

		// Format log message if formatter exists
		const formatted = this.#format ? this.#format(level, ctx, message, ...optional) : message;

		// Filter valid plugins once
		const plugins = this.#plugins.filter((p) => !!p && typeof p.handle === "function");

		// Run all plugin stages in parallel — before, handle, after
		await Promise.all(plugins.map(async (plugin) => {
			await plugin.before?.(level, ctx, formatted, ...optional);
			await plugin.handle(level, ctx, formatted, ...optional);
			await plugin.after?.(level, ctx, formatted, ...optional);
		}));

	}

	/** Log info message; accepts mixed data for this log */
	info(message: any, ...optional: any[]) {
		return this.#logInternal("info", message, ...optional);
	}

	/** Log warn message; accepts mixed data for this log */
	warn(message: any, ...optional: any[]) {
		return this.#logInternal("warn", message, ...optional);
	}

	/** Log error message; accepts mixed data for this log */
	error(message: any, ...optional: any[]) {
		return this.#logInternal("error", message, ...optional);
	}

	/** Log debug message; accepts mixed data for this log */
	debug(message: any, ...optional: any[]) {
		return this.#logInternal("debug", message, ...optional);
	}

	/** Log message at custom level; accepts mixed data for this log */
	log(level: LogLevel, message: any, ...optional: any[]) {
		return this.#logInternal(level, message, ...optional);
	}
}
export default Logger;
