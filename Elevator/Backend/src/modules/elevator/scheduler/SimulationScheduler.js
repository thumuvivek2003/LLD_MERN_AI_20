import { elevatorSimulationService } from "../service/ElevatorSimulationService.js";
import { env } from "../../../config/env.js";
import { logger } from "../../../shared/utils/logger.js";

class SimulationScheduler {
  constructor() {
    this.timer = null;
    this.intervalMs = env.TICK_INTERVAL_MS;
  }

  start() {
    if (this.timer) return;
    const speed = elevatorSimulationService.simulation?.speed || 1;
    const tickMs = Math.max(100, Math.floor(this.intervalMs / speed));
    this.timer = setInterval(() => this.tick(), tickMs);
    logger.info(`SimulationScheduler started (tick=${tickMs}ms)`);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      logger.info("SimulationScheduler stopped");
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  async tick() {
    try {
      await elevatorSimulationService.tick();
    } catch (err) {
      logger.error(`Scheduler tick error: ${err.message}`);
    }
  }
}

export const simulationScheduler = new SimulationScheduler();
