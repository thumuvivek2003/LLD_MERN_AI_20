import mongoose from "mongoose";
import { DIRECTION } from "../../../shared/constants/direction.js";
import { REQUEST_TYPE, REQUEST_STATUS } from "../../../shared/constants/requestType.js";

const requestSchema = new mongoose.Schema(
  {
    sourceFloor: { type: Number, required: true },
    destinationFloor: { type: Number, default: null },
    direction: { type: String, enum: Object.values(DIRECTION), required: true },
    type: { type: String, enum: Object.values(REQUEST_TYPE), required: true },
    status: { type: String, enum: Object.values(REQUEST_STATUS), default: REQUEST_STATUS.PENDING },
    assignedElevatorId: { type: String, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const RequestModel = mongoose.model("Request", requestSchema);
