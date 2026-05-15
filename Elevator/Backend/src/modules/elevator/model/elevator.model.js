import mongoose from "mongoose";
import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { DIRECTION } from "../../../shared/constants/direction.js";

const elevatorSchema = new mongoose.Schema(
  {
    elevatorId: { type: String, required: true, unique: true },
    currentFloor: { type: Number, default: 0 },
    direction: { type: String, enum: Object.values(DIRECTION), default: DIRECTION.NONE },
    state: { type: String, enum: Object.values(ELEVATOR_STATE), default: ELEVATOR_STATE.IDLE },
    doorState: { type: String, enum: ["OPEN", "CLOSED"], default: "CLOSED" },
    requestQueue: { type: [Number], default: [] },
    capacity: { type: Number, default: 8 },
  },
  { timestamps: true }
);

export const ElevatorModel = mongoose.model("Elevator", elevatorSchema);
