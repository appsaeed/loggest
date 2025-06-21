/* eslint-disable @typescript-eslint/no-explicit-any */

export type LogLevel = "info" | "warn" | "error" | "debug";
export type FullMeta = { ctx: Record<string, any>; meta: any };

export interface Plugin {
	log(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> | void;
}

export interface LoggerOptions {
	levels?: LogLevel[];
	plugins: Plugin[];
	context?: Record<string, any>;
	format?: (level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]) => string;
	filter?: (level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]) => boolean;
}
