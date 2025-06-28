import { jest } from "@jest/globals";
import { promises as fs } from "fs";
import FileLogger from "../../src/plugins/FileLogger";

jest.mock("fs", () => {
    const original = jest.requireActual("fs");
    return {
        ...(typeof original === "object" && original !== null ? original : {}),
        promises: {
            mkdir: jest.fn(),
            appendFile: jest.fn(),
        },
    };
});

describe("FileLogger", () => {
    const mockedMkdir = fs.mkdir as jest.Mock;
    const mockedAppendFile = fs.appendFile as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should not call fs if disabled", async () => {
        const logger = new FileLogger({ path: "/mock/log.log", disabled: true });
        await logger.init();
        await logger.handle("info", null, "Should not log");

        expect(mockedMkdir).not.toHaveBeenCalled();
        expect(mockedAppendFile).not.toHaveBeenCalled();
    });

    it("should create directory and write log if enabled", async () => {
        const logger = new FileLogger({ path: "/mock/log.log" });
        await logger.init();
        await logger.handle("info", null, "Init success", { env: "test" });

        expect(mockedMkdir).toHaveBeenCalledWith("/mock", { recursive: true });
        expect(mockedAppendFile).toHaveBeenCalled();

        const logged = mockedAppendFile.mock.calls[0][1];
        expect(logged).toMatch(/INFO/);
        expect(logged).toMatch(/Init success/);
        expect(logged).toMatch(/test/);
    });

    it("should handle different log levels", async () => {
        const logger = new FileLogger({ path: "/mock/log.log" });
        await logger.init();

        await logger.handle("warn", null, "Warn message");
        await logger.handle("debug", null, "Debug message");

        expect(mockedAppendFile).toHaveBeenCalledTimes(2);

        const [warnLog, debugLog] = mockedAppendFile.mock.calls.map(call => call[1]);

        expect(warnLog).toMatch(/\[WARN\]/);
        expect(warnLog).toMatch(/Warn message/);

        expect(debugLog).toMatch(/\[DEBUG\]/);
        expect(debugLog).toMatch(/Debug message/);
    });

    it("should not include optional data if not provided", async () => {
        const logger = new FileLogger({ path: "/mock/log.log" });
        await logger.init();
        await logger.handle("info", null, "Just message");

        const logged = mockedAppendFile.mock.calls[0][1];
        expect(logged).toMatch(/Just message/);
        expect(logged).not.toMatch(/\{.*\}/); // no JSON payload at the end
    });

    it("should include encoded optional arguments", async () => {
        const logger = new FileLogger({ path: "/mock/log.log" });
        await logger.init();

        await logger.handle("info", null, "Message with args", { user: "admin" }, 123);

        const logged = mockedAppendFile.mock.calls[0][1];
        expect(logged).toMatch(/"user":"admin"/);
        expect(logged).toMatch(/123/);
    });
});
