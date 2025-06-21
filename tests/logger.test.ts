import { Logger } from "../src/logger";

// Mock Plugin
const createMockPlugin = () => {
	return {
		handle: jest.fn(),
	};
};

describe("Logger", () => {
	let plugin: ReturnType<typeof createMockPlugin>;
	let logger: Logger;

	beforeEach(() => {
		plugin = createMockPlugin();
		logger = new Logger({
			plugins: [plugin],
		});
	});

	it("should call plugin's log method for allowed level", async () => {
		await logger.info("Hello");

		expect(plugin.handle).toHaveBeenCalledWith("info", {}, "Hello");
	});

	it("should not log if level is not in allowed levels", async () => {
		logger = new Logger({
			levels: ["error"],
			plugins: [plugin],
		});
		await logger.info("This should be ignored");

		expect(plugin.handle).not.toHaveBeenCalled();
	});

	it("should apply format if provided", async () => {
		const formatter = jest.fn().mockImplementation((level, ctx, msg) => {
			return `[${level.toUpperCase()}] ${msg}`;
		});

		logger = new Logger({
			plugins: [plugin],
			format: formatter,
		});

		await logger.warn("Formatted message");

		expect(formatter).toHaveBeenCalled();
		expect(plugin.handle).toHaveBeenCalledWith("warn", {}, "[WARN] Formatted message");
	});

	it("should apply context", async () => {
		logger = new Logger({
			plugins: [plugin],
			context: { env: "test" },
		});
		await logger.error("Test error");

		expect(plugin.handle).toHaveBeenCalledWith("error", { env: "test" }, "Test error");
	});

	it("should skip log if filter returns false", async () => {
		const filter = jest.fn().mockReturnValue(false);

		logger = new Logger({
			plugins: [plugin],
			filter,
		});
		await logger.debug("Ignore me");

		expect(filter).toHaveBeenCalled();
		expect(plugin.handle).not.toHaveBeenCalled();
	});

	it("should pass optional params to filter and format", async () => {
		const filter = jest.fn().mockReturnValue(true);
		const format = jest.fn().mockImplementation((level, ctx, msg, ...opt) => msg + JSON.stringify(opt));

		logger = new Logger({
			plugins: [plugin],
			filter,
			format,
		});

		await logger.info("Hello", { user: "Saeed" });

		expect(filter).toHaveBeenCalledWith("info", {}, "Hello", { user: "Saeed" });
		expect(format).toHaveBeenCalledWith("info", {}, "Hello", { user: "Saeed" });
		expect(plugin.handle).toHaveBeenCalledWith("info", {}, 'Hello[{"user":"Saeed"}]', { user: "Saeed" });
	});
});
