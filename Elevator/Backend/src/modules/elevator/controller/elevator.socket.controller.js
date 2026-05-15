import { elevatorSimulationService } from "../service/ElevatorSimulationService.js";
import { simulationScheduler } from "../scheduler/SimulationScheduler.js";
import { SIMULATION_STATUS, ELEVATOR_EVENT } from "../../../shared/constants/elevatorEvent.js";
import { elevatorEventBus } from "../events/ElevatorEventBus.js";

export async function onSimulationStart() {
  await elevatorSimulationService.updateSimulation({
    status: SIMULATION_STATUS.RUNNING,
    startedAt: new Date(),
  });
  simulationScheduler.restart();
}

export async function onSimulationPause() {
  await elevatorSimulationService.updateSimulation({ status: SIMULATION_STATUS.PAUSED });
}

export async function broadcastElevatorState() {
  const snapshot = await elevatorSimulationService.getSnapshot();
  elevatorEventBus.publish(ELEVATOR_EVENT.SIMULATION_TICK, snapshot);
}
