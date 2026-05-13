import { v4 as uuidv4 } from "uuid";
import { SessionModel } from "../entities/Session.js";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";
import { ATMStateError } from "../../../core/errors/ATMStateError.js";
import { isSessionExpired } from "../../../core/utils/session.util.js";

export async function createSession() {
  const sessionId = uuidv4();
  return SessionModel.create({
    sessionId,
    state: ATM_STATE.IDLE,
    lastActivityAt: new Date(),
  });
}

export async function getSession(sessionId) {
  return SessionModel.findOne({ sessionId });
}

export async function updateLastActivity(sessionId) {
  return SessionModel.findOneAndUpdate(
    { sessionId },
    { lastActivityAt: new Date() },
    { new: true }
  );
}

export async function validateSession(sessionId) {
  const session = await SessionModel.findOne({ sessionId });
  if (!session) throw new ATMStateError("Session not found", "SESSION_NOT_FOUND");
  if (isSessionExpired(session.lastActivityAt) && session.state !== ATM_STATE.IDLE) {
    session.state = ATM_STATE.IDLE;
    session.authenticated = false;
    session.cardNumber = null;
    session.bankCode = null;
    session.bankName = null;
    session.pendingTransactionId = null;
    session.pendingBreakdown = null;
    session.pendingInventoryAfter = null;
    session.pendingAmount = null;
    await session.save();
    throw new ATMStateError("Session expired due to inactivity", "SESSION_EXPIRED");
  }
  return session;
}

export async function destroySession(sessionId) {
  return SessionModel.findOneAndUpdate(
    { sessionId },
    {
      state: ATM_STATE.IDLE,
      authenticated: false,
      cardNumber: null,
      bankCode: null,
      bankName: null,
      pendingTransactionId: null,
      pendingBreakdown: null,
      pendingInventoryAfter: null,
      pendingAmount: null,
      lastActivityAt: new Date(),
    },
    { new: true }
  );
}
