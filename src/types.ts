/* eslint-disable @typescript-eslint/no-explicit-any */

export type LogLevel = "info" | "warn" | "error" | "debug";
export type FullMeta = { ctx: Record<string, any>; meta: any };

export interface Plugin {
	/**
	 * Optional hook executed init handling.
	 */
	init?(options: LoggerOptions): void;

	/**
	 * Optional hook executed before handling a log message.
	 */
	before?(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> | void;

	/**
	 * The main method to process or output a log message.
	 */
	handle(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> | void;

	/**
	 * Optional hook executed after handling a log message.
	 */
	after?(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> | void;
}

export interface LoggerOptions {
	levels?: LogLevel[];
	plugins: Plugin[];
	context?: Record<string, any>;
	format?: (level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]) => string;
	filter?: (level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]) => boolean;
}
