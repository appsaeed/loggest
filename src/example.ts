import { Logger } from "./logger";
import { ConsoleLog } from "./plugins";
import FileLog from "./plugins/FileLog";

const logger = new Logger({
	plugins: [new FileLog({ path: "./logs/node.log" }), new ConsoleLog()],
});

logger.info("hello", { name: "saeed", age: "23" });
logger.log("debug", "helo world");
