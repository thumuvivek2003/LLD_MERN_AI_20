import http from "http";
import { bootstrapApplication } from "./app.js";
import { env } from "./config/env.js";
import { connectMongoDB } from "./config/db.js";
import { initializeSocketServer } from "./config/socket.js";
import { elevatorSimulationService } from "./modules/elevator/service/ElevatorSimulationService.js";
import { simulationScheduler } from "./modules/elevator/scheduler/SimulationScheduler.js";
import { registerElevatorEventHandlers } from "./modules/elevator/events/ElevatorEventHandler.js";
import { SIMULATION_STATUS } from "./shared/constants/elevatorEvent.js";
import { logger } from "./shared/utils/logger.js";

export async function startServer() {
  await connectMongoDB();

  const app = bootstrapApplication();
  const httpServer = http.createServer(app);

  initializeSocketServer(httpServer);
  registerElevatorEventHandlers();

  await elevatorSimulationService.initialize();

  if (elevatorSimulationService.simulation?.status === SIMULATION_STATUS.RUNNING) {
    simulationScheduler.start();
  }

  httpServer.listen(env.PORT, () => {
    logger.info(`Elevator backend listening on http://localhost:${env.PORT}`);
  });

  return httpServer;
}
