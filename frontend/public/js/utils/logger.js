import winston from 'winston';
import path from 'path';
// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
    mkdirSync(path.join(process.cwd(), 'logs'), { recursive: true });
}
catch (error) {
    // Directory might already exist
}
const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || 'logs/app.log';
// Define log format
const logFormat = winston.format.combine(winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
}), winston.format.errors({ stack: true }), winston.format.json());
// Console format for development
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({
    format: 'HH:mm:ss'
}), winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        try {
            msg += ` ${JSON.stringify(meta, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (value.constructor?.name === 'TLSSocket' ||
                        value.constructor?.name === 'HTTPParser' ||
                        key === 'socket' ||
                        key === 'parser') {
                        return '[Circular]';
                    }
                }
                return value;
            })}`;
        }
        catch (error) {
            msg += ` [Unable to serialize meta data]`;
        }
    }
    return msg;
}));
// Create logger instance
export const logger = winston.createLogger({
    level: logLevel,
    format: logFormat,
    defaultMeta: { service: 'mcp-agent-kit' },
    transports: [
        // File transport
        new winston.transports.File({
            filename: logFile,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Error file transport
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});
// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}
// Create a simple logger for tools that don't need full Winston
export const simpleLogger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[ERROR] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[WARN] ${message}`, ...args);
    },
    debug: (message, ...args) => {
        if (logLevel === 'debug') {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    }
};
