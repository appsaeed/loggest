/* eslint-disable @typescript-eslint/no-explicit-any */

export type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Context metadata for logger environment and additional info.
 */
export type Context = {

	/**
	 * application name.
	 */
	name?: string;

	/**
	 * application url.
	 */
	url?: string;

	/**
	 * application environment.
	 */
	env?: string;

	/**
	 * application mode.
	 */
	mode?: 'production' | 'development' | 'testing' | 'test';

	/**
	 * application unique identifier for the current logger instance.
	 */
	loggerId?: string;

	/**
	 * Optional additional arbitrary metadata.
	 */
	[key: string]: any;
};


export interface Plugin {
	/**
	 * Optional hook executed init handling.
	 *
	 * This hook runs once when the plugin is initialized.
	 */
	init?(options: LoggerOptions): void;

	/**
	 * Optional hook executed before handling a log message.
	 *
	 * This hook runs every time before the plugin’s log handler.
	 */
	before?(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> | void;

	/**
	 * The main method to process or output a log message.
	 *
	 * This is the core plugin handler called on every log call.
	 */
	handle(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> | void;

	/**
	 * Optional hook executed after handling a log message.
	 *
	 * This hook runs every time after the plugin’s log handler.
	 */
	after?(level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]): Promise<void> | void;
}

export interface LoggerOptions {
	/**
	 * list of log levels to enable.
	 */
	levels?: LogLevel[];

	/**
	 * Array of plugins to extend logger functionality.
	 */
	plugins: Plugin[];

	/**
	 * Shared context object attached to every log entry.
	 *
	 * Useful for adding metadata like request IDs or user information.
	 */
	context?: Context;

	/**
	 * Optional formatter function to customize log message output.
	 *
	 * Should return a entry to representing the formatted log message.
	 */
	format?: (level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]) => any;

	/**
	 * Optional filter function to control which messages are logged.
	 *
	 * Return `true` to allow logging, `false` to skip the message.
	 */
	filter?: (level: LogLevel, ctx: Record<string, any>, message: any, ...optional: any[]) => boolean;
}
