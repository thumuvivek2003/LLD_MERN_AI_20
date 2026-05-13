import * as sessionService from "./session.service.js";
import * as txnService from "./transaction.service.js";
import * as cashDispenser from "../../cash/services/cashDispenser.service.js";
import * as cardRepo from "../../bank/repositories/card.repository.js";
import { createBankService } from "../../bank/factory/bankService.factory.js";
import { BANK_NAME } from "../../../core/constants/bank.constants.js";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from "../../../core/constants/transaction.constants.js";
import { ATM } from "../entities/ATM.js";
import { ATMStateError } from "../../../core/errors/ATMStateError.js";
import { AuthenticationError } from "../../../core/errors/AuthenticationError.js";
import { CardBlockedError } from "../../../core/errors/CardBlockedError.js";
import { validateDenominationAmount } from "../../../core/utils/amount.util.js";

function buildAtmFromSession(session) {
  return new ATM(session.state);
}

function toBreakdownArray(breakdownObj) {
  return [2000, 500, 200, 100]
    .map((d) => ({ denomination: d, count: breakdownObj?.[d] || 0 }))
    .filter((r) => r.count > 0);
}

export async function initializeSession({ cardNumber }) {
  const card = await cardRepo.findCard(cardNumber);
  if (!card) throw new AuthenticationError("Card not recognized");
  if (card.isBlocked) throw new CardBlockedError();

  const session = await sessionService.createSession();
  const atm = buildAtmFromSession(session);
  atm.handleOperation("insertCard");

  session.state = atm.getState();
  session.cardNumber = card.cardNumber;
  session.bankCode = card.bankCode;
  session.bankName = BANK_NAME[card.bankCode] || card.bankCode;
  session.lastActivityAt = new Date();
  await session.save();

  return {
    sessionId: session.sessionId,
    state: session.state,
    bankCode: session.bankCode,
    bankName: session.bankName,
  };
}

export async function authenticateUser({ sessionId, pin }) {
  const session = await sessionService.validateSession(sessionId);
  if (session.state !== ATM_STATE.CARD_INSERTED) {
    throw new ATMStateError(`Cannot enter PIN in state ${session.state}`);
  }

  const bank = createBankService(session.bankCode);
  // BankService.authenticate throws on wrong PIN / blocked card.
  const result = await bank.authenticate(session.cardNumber, pin);

  const atm = buildAtmFromSession(session);
  atm.handleOperation("enterPin", true);

  session.state = atm.getState();
  session.authenticated = true;
  session.lastActivityAt = new Date();
  await session.save();

  return {
    sessionId: session.sessionId,
    state: session.state,
    success: true,
    attemptsLeft: result.attemptsLeft,
  };
}

export async function processBalanceCheck({ sessionId }) {
  const session = await sessionService.validateSession(sessionId);
  if (session.state !== ATM_STATE.AUTHENTICATED) {
    throw new ATMStateError(`Cannot check balance in state ${session.state}`);
  }

  const bank = createBankService(session.bankCode);
  const txn = await txnService.startTransaction({
    type: TRANSACTION_TYPE.BALANCE_CHECK,
    cardNumber: session.cardNumber,
    bankCode: session.bankCode,
  });

  const balance = await bank.checkBalance(session.cardNumber);
  await txnService.completeTransaction(txn.transactionId, { balanceAfter: balance });

  session.lastActivityAt = new Date();
  await session.save();

  return { sessionId: session.sessionId, balance, transactionId: txn.transactionId };
}

export async function previewWithdrawal({ sessionId, amount }) {
  const session = await sessionService.validateSession(sessionId);
  if (session.state !== ATM_STATE.AUTHENTICATED) {
    throw new ATMStateError(`Cannot preview withdrawal in state ${session.state}`);
  }

  const validAmount = validateDenominationAmount(amount);
  const bank = createBankService(session.bankCode);
  const balance = await bank.checkBalance(session.cardNumber);
  if (balance < validAmount) {
    const err = new (await import("../../../core/errors/InsufficientBalanceError.js")).InsufficientBalanceError();
    throw err;
  }

  const { breakdown, total } = await cashDispenser.prepareCash(validAmount);

  session.lastActivityAt = new Date();
  await session.save();
  return { sessionId: session.sessionId, amount: validAmount, breakdown: toBreakdownArray(breakdown), total };
}

export async function processWithdrawal({ sessionId, amount }) {
  const session = await sessionService.validateSession(sessionId);
  if (session.state !== ATM_STATE.AUTHENTICATED) {
    throw new ATMStateError(`Cannot withdraw in state ${session.state}`);
  }

  const validAmount = validateDenominationAmount(amount);
  const bank = createBankService(session.bankCode);
  const txn = await txnService.startTransaction({
    type: TRANSACTION_TYPE.WITHDRAW,
    cardNumber: session.cardNumber,
    bankCode: session.bankCode,
    amount: validAmount,
  });

  try {
    const { breakdown, inventoryAfter } = await cashDispenser.prepareCash(validAmount);
    const balanceAfter = await bank.withdraw(session.cardNumber, validAmount);
    await cashDispenser.collectCash(inventoryAfter);
    await txnService.completeTransaction(txn.transactionId, { breakdown, balanceAfter });

    const atm = buildAtmFromSession(session);
    atm.handleOperation("withdrawCash");

    session.state = atm.getState();
    session.pendingTransactionId = txn.transactionId;
    session.pendingBreakdown = breakdown;
    session.pendingAmount = validAmount;
    session.lastActivityAt = new Date();
    await session.save();

    return {
      sessionId: session.sessionId,
      state: session.state,
      transactionId: txn.transactionId,
      amount: validAmount,
      breakdown: toBreakdownArray(breakdown),
      balanceAfter,
    };
  } catch (err) {
    await txnService.failTransaction(txn.transactionId, err.message);
    throw err;
  }
}

export async function completeTransaction({ sessionId }) {
  const session = await sessionService.validateSession(sessionId);
  if (session.state !== ATM_STATE.DISPENSING_CASH) {
    throw new ATMStateError(`Cannot collect cash in state ${session.state}`);
  }

  if (session.pendingTransactionId) {
    await txnService.markCollected(session.pendingTransactionId);
  }

  const atm = buildAtmFromSession(session);
  atm.handleOperation("collectCash");

  session.state = atm.getState();
  session.pendingTransactionId = null;
  session.pendingBreakdown = null;
  session.pendingInventoryAfter = null;
  session.pendingAmount = null;
  session.lastActivityAt = new Date();
  await session.save();

  return { sessionId: session.sessionId, state: session.state };
}

export async function resetATM({ sessionId }) {
  const session = await sessionService.getSession(sessionId);
  if (!session) {
    return { sessionId, state: ATM_STATE.IDLE };
  }
  const updated = await sessionService.destroySession(sessionId);
  return { sessionId: updated.sessionId, state: updated.state };
}

export async function getSessionStatus({ sessionId }) {
  const session = await sessionService.getSession(sessionId);
  if (!session) throw new ATMStateError("Session not found", "SESSION_NOT_FOUND");
  return {
    sessionId: session.sessionId,
    state: session.state,
    bankCode: session.bankCode,
    bankName: session.bankName,
    authenticated: session.authenticated,
    lastActivityAt: session.lastActivityAt,
  };
}

export { TRANSACTION_STATUS };
