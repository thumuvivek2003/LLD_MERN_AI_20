import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../core/errors/AppError.js";
import { roundAmount } from "../../core/utils/amount.util.js";
import * as settlementRepo from "./settlement.repository.js";
import * as groupRepo from "../group/group.repository.js";
import { toSettlementDTO } from "./settlement.model.js";

async function loadGroupOrThrow(groupId) {
  const group = await groupRepo.findGroupById(groupId);
  if (!group) throw new AppError("GROUP_NOT_FOUND", 404, "Group not found");
  return group;
}

export async function settleUp(groupId, { fromUserId, toUserId, amount, note }) {
  const group = await loadGroupOrThrow(groupId);

  if (!fromUserId || !toUserId) {
    throw new AppError("VALIDATION_ERROR", 400, "fromUserId and toUserId are required");
  }
  if (fromUserId === toUserId) {
    throw new AppError("VALIDATION_ERROR", 400, "fromUserId and toUserId must differ");
  }
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    throw new AppError("VALIDATION_ERROR", 400, "amount must be a positive number");
  }

  const members = new Set(group.members.map((m) => m.userId));
  if (!members.has(fromUserId) || !members.has(toUserId)) {
    throw new AppError("NOT_A_MEMBER", 409, "Both users must be members of the group");
  }

  const doc = await settlementRepo.createSettlement({
    settlementId: uuidv4(),
    groupId,
    fromUserId,
    toUserId,
    amount: roundAmount(amt),
    note: note ? String(note).trim() : "",
  });
  return toSettlementDTO(doc);
}

export async function getSettlementHistory(groupId) {
  await loadGroupOrThrow(groupId);
  const docs = await settlementRepo.findSettlementsByGroup(groupId);
  return docs.map(toSettlementDTO);
}
