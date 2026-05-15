import { Server } from "socket.io";
import { env } from "./env.js";
import { logger } from "../shared/utils/logger.js";

let ioInstance = null;

export function initializeSocketServer(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: { origin: env.CLIENT_ORIGIN, methods: ["GET", "POST"] },
  });

  ioInstance.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () => logger.info(`Socket disconnected: ${socket.id}`));
  });

  return ioInstance;
}

export function getIO() {
  if (!ioInstance) throw new Error("Socket.io not initialized");
  return ioInstance;
}
