import mongoose from "mongoose";
import { connectMongoDB } from "../config/db.js";
import { env } from "../config/env.js";
import { logger } from "../shared/utils/logger.js";
import { SimulationModel } from "../modules/elevator/model/simulation.model.js";
import { ElevatorModel } from "../modules/elevator/model/elevator.model.js";
import { RequestModel } from "../modules/elevator/model/request.model.js";
import { SIMULATION_STATUS } from "../shared/constants/elevatorEvent.js";
import { ELEVATOR_STATE } from "../shared/constants/elevatorState.js";
import { DIRECTION } from "../shared/constants/direction.js";
import { REQUEST_TYPE, REQUEST_STATUS } from "../shared/constants/requestType.js";

const START_FLOORS = [0, 2, 5, 8];

async function seed() {
  await connectMongoDB();

  await Promise.all([
    SimulationModel.deleteMany({}),
    ElevatorModel.deleteMany({}),
    RequestModel.deleteMany({}),
  ]);

  await SimulationModel.create({
    status: SIMULATION_STATUS.RUNNING,
    speed: 1,
    totalFloors: env.TOTAL_FLOORS,
    totalElevators: env.TOTAL_ELEVATORS,
    strategyName: "NEAREST",
    startedAt: new Date(),
  });

  for (let i = 1; i <= env.TOTAL_ELEVATORS; i++) {
    await ElevatorModel.create({
      elevatorId: `E${i}`,
      currentFloor: START_FLOORS[i - 1] ?? 0,
      state: ELEVATOR_STATE.IDLE,
      direction: DIRECTION.NONE,
      doorState: "CLOSED",
      requestQueue: [],
      capacity: 8,
    });
  }

  await RequestModel.insertMany([
    {
      sourceFloor: 3,
      destinationFloor: null,
      direction: DIRECTION.UP,
      type: REQUEST_TYPE.HALL,
      status: REQUEST_STATUS.PENDING,
    },
    {
      sourceFloor: 9,
      destinationFloor: 1,
      direction: DIRECTION.DOWN,
      type: REQUEST_TYPE.HALL,
      status: REQUEST_STATUS.PENDING,
    },
    {
      sourceFloor: 6,
      destinationFloor: null,
      direction: DIRECTION.DOWN,
      type: REQUEST_TYPE.HALL,
      status: REQUEST_STATUS.PENDING,
    },
  ]);

  logger.info(
    `Seeded ${env.TOTAL_ELEVATORS} elevators, ${env.TOTAL_FLOORS} floors, 3 sample hall requests. Status=RUNNING`
  );
  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error(`Seed failed: ${err.message}`);
    process.exit(1);
  });
