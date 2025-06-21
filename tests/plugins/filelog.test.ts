/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock("fs", () => ({
	promises: {
		mkdir: jest.fn(),
		appendFile: jest.fn(),
	},
}));

import { promises as fs } from "fs";
import FileLog from "../../src/plugins/FileLog";

describe("FileLog", () => {
	const filePath = "./test.log";

	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Define test cases as tuples: [level, message, optionalParams]
	const cases: Array<[string, string, unknown[]]> = [
		["error", "Something broke", [{ user: "Saeed" }]],
		["info", "All good", []],
		["warn", "Watch out", [{ retry: true }]],
		["debug", "Debugging data", [{ data: { id: 123 } }]],
	];

	test.each(cases)("logs level %s with message '%s' and optional %p", async (level, message, optional) => {
		const plugin = new FileLog({ path: filePath });

		await plugin.log(level as any, {}, message, ...optional);

		// mkdir always called once with correct args
		expect(fs.mkdir).toHaveBeenCalledWith(".", { recursive: true });

		// appendFile called once with filePath and log line containing message string
		expect(fs.appendFile).toHaveBeenCalledWith(filePath, expect.stringContaining(message));

		// Optional: Check if optional JSON string is present in log line (if optional provided)
		if (optional.length > 0) {
			const optionalJson = JSON.stringify(optional);
			expect(fs.appendFile).toHaveBeenCalledWith(expect.anything(), expect.stringContaining(optionalJson));
		}
	});
});
