type Level = "info" | "warn" | "error" | "debug";
type LogEntry = { level: Level; message: string; data?: unknown; timestamp: string };

const LOG_LEVELS: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL: number =
  process.env.LOG_LEVEL
    ? LOG_LEVELS[process.env.LOG_LEVEL as Level] ?? 1
    : process.env.NODE_ENV === "production" ? 2 : 0;

function shouldLog(level: Level): boolean {
  return LOG_LEVELS[level] >= CURRENT_LEVEL;
}

export function log(level: Level, message: string, data?: unknown) {
  if (!shouldLog(level)) return;
  const entry: LogEntry = { level, message, data, timestamp: new Date().toISOString() };
  queueMicrotask(() => {
    if (level === "error") console.error(JSON.stringify(entry));
    else console.log(JSON.stringify(entry));
  });
}

export const logger = {
  debug: (msg: string, data?: unknown) => log("debug", msg, data),
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
};
