import mongoose from "mongoose";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";
import { isSessionExpired } from "../../../core/utils/session.util.js";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    state: { type: String, enum: Object.values(ATM_STATE), default: ATM_STATE.IDLE },
    cardNumber: { type: String, default: null },
    bankCode: { type: String, default: null },
    bankName: { type: String, default: null },
    authenticated: { type: Boolean, default: false },
    lastActivityAt: { type: Date, default: Date.now },
    pendingTransactionId: { type: String, default: null },
    pendingBreakdown: { type: Object, default: null },
    pendingInventoryAfter: { type: Object, default: null },
    pendingAmount: { type: Number, default: null },
  },
  { timestamps: true, minimize: false }
);

sessionSchema.methods.updateActivity = function () {
  this.lastActivityAt = new Date();
  return this.save();
};

sessionSchema.methods.isExpired = function () {
  return isSessionExpired(this.lastActivityAt);
};

export const SessionModel = mongoose.model("Session", sessionSchema);
