import { elevatorEventBus } from "./ElevatorEventBus.js";
import { ELEVATOR_EVENT } from "../../../shared/constants/elevatorEvent.js";
import { getIO } from "../../../config/socket.js";
import { logger } from "../../../shared/utils/logger.js";

let registered = false;

export function registerElevatorEventHandlers() {
  if (registered) return;
  registered = true;

  elevatorEventBus.on(ELEVATOR_EVENT.ELEVATOR_UPDATE, (payload) => {
    safeEmit(ELEVATOR_EVENT.ELEVATOR_UPDATE, payload);
  });

  elevatorEventBus.on(ELEVATOR_EVENT.REQUEST_CREATED, (payload) => {
    safeEmit(ELEVATOR_EVENT.REQUEST_CREATED, payload);
  });

  elevatorEventBus.on(ELEVATOR_EVENT.REQUEST_COMPLETED, (payload) => {
    safeEmit(ELEVATOR_EVENT.REQUEST_COMPLETED, payload);
  });

  elevatorEventBus.on(ELEVATOR_EVENT.SIMULATION_TICK, (payload) => {
    safeEmit(ELEVATOR_EVENT.SIMULATION_TICK, payload);
  });

  elevatorEventBus.on(ELEVATOR_EVENT.EVENT_LOG, (payload) => {
    elevatorEventBus.appendLog(payload);
    safeEmit(ELEVATOR_EVENT.EVENT_LOG, payload);
  });
}

function safeEmit(event, payload) {
  try {
    getIO().emit(event, payload);
  } catch (err) {
    logger.warn(`Socket emit failed for ${event}: ${err.message}`);
  }
}
