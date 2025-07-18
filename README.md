# Fast & Pluggable logger

> A flexible, minimalistic logging utility package — fast and pluggable.

### ✨ Features

- ⚡ Fast and lightweight
- 🔌 Plugin-based logging (File, Console, API, Custom)
- 🧩 Custom log drivers (e.g., database, HTTP)
- 🗃️ File and remote/API logging
- 🧠 Context-aware and structured logs
- 🎚️ Filterable and configurable log levels

Includes everything needed for structured logging, while remaining small and dependency-free.

## 📦 Installation

```bash
npm install loggest
```

## 🚀 Basic Usage

A logger instance can be initialized with one or more plugins to control how logs are processed.

### Inline Plugin Example

```ts
import { Logger } from "loggest";

const logger = new Logger({
  plugins: [
    {
      handle: function (level, context, message, ...optional) {
        console.log(level, message, ...optional);
      },
    },
  ],
});

logger.info({ name: "app", version: "1.x" });
logger.info("Application started", "additional context");
```

### Using Imported Plugins

```ts
import { Logger } from "loggest";
import FileLog from "loggest/dist/plugins/FileLog";

const logger = new Logger({
  plugins: [new FileLog()],
});

logger.info({ name: "app", version: "1.x" });
logger.info("Application started", "additional context");
```

Plugins can be mixed and matched, and custom implementations can also be added as needed. See the [Available Plugins](#-available-plugins) section for more examples.

## ⚙️ Advanced Configuration

```ts
import Logger from "loggest";
import FileLog from "loggest/dist/plugins/FileLog"
import ApiLog from "loggest/dist/plugins/ApiLog"

const logger = new Logger({
	// customize level defalut: info, warn, error, debug, log.
	levels: ["info", "warn"] //now only will log info, warn.
	plugins: [
		new ApiLog({ url: "https://example.com/logs" }),
		//other plugins
	],
	context: { app: "my-app", env: "production" } // context object (optional),
	format: (level, ctx, msg, ...rest) => `New message: ${msg}`,
	filter: (level, ctx, msg, ...rest) => level !== "warn" // avoid warn log,
});
```

## 📋 Available Plugins

The logger includes several built-in plugins for common logging use cases:

- `FileLog` – Writes logs to a file.
- `FetchLog` – Sends logs to an external HTTP endpoint.
- `ConsoleLog` – Outputs logs to the console.
- `CustomLog` – Allows defining custom behavior via plugin.

Custom plugins can be created using either an object or a class.

### 🔧 Object-based Plugin Example

```ts
const CustomLogger = {
  /**
   * Handle the plugin log
   */
  handle: async (level: LogLevel, ctx, message: any, ...optional: any[]) => {
    // Custom handling logic: store in a database, send to an API, etc.
  },
};
```

### Class-based Plugin Example

```ts
export class ColoredConsoleLog {
  /**
   * Handle the plugin log
   */
  async handle(level, ctx, message, ...optional) {
    const colorMap = {
      info: "\x1b[36m", // Cyan
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      debug: "\x1b[90m", // Gray
    };
    console.log(`${colorMap[level] || ""}${level}:`, message, ...optional);
  }
}
```

### ✅ Registering Plugins

```ts
const logger = new Logger({
  plugins: [new ColoredConsoleLog(), CustomLogger],
});

logger.info("Server started successfully");
```

### 🧩 Plugin Interface for TypeScript

To enable type checking and IntelliSense support, implement the `Plugin` interface:

```ts
import { LogLevel, Plugin } from "loggest";

export class MyLogger implements Plugin {
  //handle the plugin log
  async handle(level: LogLevel, ctx: any, message: any, ...optional: any[]): Promise<void> {
    // Custom logic for handling log output
  }
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repo
2. Create a branch
3. Commit changes
4. Open a PR

Let’s improve this project together!

## 📄 License

MIT License — Saeed Hosan
