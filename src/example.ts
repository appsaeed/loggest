import { Logger } from "./logger";
import ConsoleLog from "./plugins/ConsoleLog";
import FileLog from "./plugins/FileLog";

const logger = new Logger({
	plugins: [new FileLog({ path: "./logs/node.log" }), new ConsoleLog()],
});

logger.info("hello", { name: "saeed", age: "23" });
logger.log("debug", "new world");
