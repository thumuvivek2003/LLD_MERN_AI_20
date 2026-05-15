import mongoose from "mongoose";
import { SIMULATION_STATUS } from "../../../shared/constants/elevatorEvent.js";

const simulationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(SIMULATION_STATUS),
      default: SIMULATION_STATUS.PAUSED,
    },
    speed: { type: Number, default: 1 },
    totalFloors: { type: Number, default: 11 },
    totalElevators: { type: Number, default: 4 },
    strategyName: { type: String, default: "NEAREST" },
    startedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const SimulationModel = mongoose.model("Simulation", simulationSchema);
