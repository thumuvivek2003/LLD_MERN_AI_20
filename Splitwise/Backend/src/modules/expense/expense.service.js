import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../core/errors/AppError.js";
import { roundAmount } from "../../core/utils/amount.util.js";
import * as expenseRepo from "./expense.repository.js";
import * as groupRepo from "../group/group.repository.js";
import { SplitStrategyFactory } from "./factories/SplitStrategyFactory.js";
import { toExpenseDTO } from "./expense.model.js";

const SPLIT_TYPES = ["EQUAL", "EXACT", "PERCENT"];

async function loadGroupOrThrow(groupId) {
  const group = await groupRepo.findGroupById(groupId);
  if (!group) throw new AppError("GROUP_NOT_FOUND", 404, "Group not found");
  return group;
}

async function loadExpenseOrThrow(expenseId) {
  const doc = await expenseRepo.findExpenseById(expenseId);
  if (!doc) throw new AppError("EXPENSE_NOT_FOUND", 404, "Expense not found");
  return doc;
}

function activeMemberIds(group) {
  return new Set(group.members.filter((m) => m.status === "ACTIVE").map((m) => m.userId));
}

function validateExpensePayload({ description, amount, paidBy, splitType, participants }, group) {
  if (!description || typeof description !== "string" || !description.trim()) {
    throw new AppError("VALIDATION_ERROR", 400, "description is required");
  }
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    throw new AppError("VALIDATION_ERROR", 400, "amount must be a positive number");
  }
  if (!paidBy || typeof paidBy !== "string") {
    throw new AppError("VALIDATION_ERROR", 400, "paidBy is required");
  }
  if (!SPLIT_TYPES.includes(splitType)) {
    throw new AppError("VALIDATION_ERROR", 400, `splitType must be one of ${SPLIT_TYPES.join(", ")}`);
  }
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new AppError("VALIDATION_ERROR", 400, "participants must be a non-empty array");
  }

  const active = activeMemberIds(group);
  if (!active.has(paidBy)) {
    throw new AppError("NOT_A_MEMBER", 409, "paidBy is not an active member of this group");
  }
  for (const p of participants) {
    if (!active.has(p)) {
      throw new AppError("NOT_A_MEMBER", 409, `Participant ${p} is not an active member of this group`);
    }
  }
}

export async function addExpense(groupId, payload) {
  const group = await loadGroupOrThrow(groupId);
  validateExpensePayload(payload, group);

  const amount = roundAmount(payload.amount);
  const strategy = SplitStrategyFactory.createStrategy(payload.splitType);
  const shares = strategy.calculateShares(amount, payload.participants, payload.splitInput || {});

  const doc = await expenseRepo.createExpense({
    expenseId: uuidv4(),
    groupId,
    description: payload.description.trim(),
    amount,
    paidBy: payload.paidBy,
    splitType: payload.splitType,
    participants: [...payload.participants],
    shares,
  });
  return toExpenseDTO(doc);
}

export async function listGroupExpenses(groupId) {
  await loadGroupOrThrow(groupId);
  const docs = await expenseRepo.findExpensesByGroup(groupId);
  return docs.map(toExpenseDTO);
}

export async function getExpense(expenseId) {
  const doc = await loadExpenseOrThrow(expenseId);
  return toExpenseDTO(doc);
}

export async function updateExpense(expenseId, payload) {
  const existing = await loadExpenseOrThrow(expenseId);
  const group = await loadGroupOrThrow(existing.groupId);

  const merged = {
    description: payload.description ?? existing.description,
    amount: payload.amount ?? existing.amount,
    paidBy: payload.paidBy ?? existing.paidBy,
    splitType: payload.splitType ?? existing.splitType,
    participants: payload.participants ?? existing.participants,
    splitInput: payload.splitInput,
  };

  validateExpensePayload(merged, group);

  const amount = roundAmount(merged.amount);
  const strategy = SplitStrategyFactory.createStrategy(merged.splitType);

  let splitInputForRecompute = merged.splitInput;
  if (!splitInputForRecompute) {
    if (merged.splitType === "EXACT") {
      splitInputForRecompute = {
        amounts: Object.fromEntries((existing.shares || []).map((s) => [s.userId, s.amount])),
      };
    } else if (merged.splitType === "PERCENT") {
      const baseAmount = existing.amount || amount;
      splitInputForRecompute = {
        percents: Object.fromEntries(
          (existing.shares || []).map((s) => [s.userId, (s.amount / baseAmount) * 100])
        ),
      };
    } else {
      splitInputForRecompute = {};
    }
  }

  const shares = strategy.calculateShares(amount, merged.participants, splitInputForRecompute);

  existing.description = merged.description.trim();
  existing.amount = amount;
  existing.paidBy = merged.paidBy;
  existing.splitType = merged.splitType;
  existing.participants = [...merged.participants];
  existing.shares = shares;

  await expenseRepo.saveExpense(existing);
  return toExpenseDTO(existing);
}

export async function deleteExpense(expenseId) {
  await loadExpenseOrThrow(expenseId);
  await expenseRepo.deleteExpense(expenseId);
  return { success: true };
}
