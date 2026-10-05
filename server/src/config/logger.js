import morgan from "morgan";
import winston from "winston";

// Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} [${info.level}]: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

// Morgan middleware for Express
export const morganMiddleware = morgan("dev");

export default logger;
