import { startServer } from "./server.js";
import { logger } from "./shared/utils/logger.js";

async function initializeApplication() {
  try {
    await startServer();
  } catch (err) {
    logger.error(`Fatal startup error: ${err.message}`);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
});

initializeApplication();
