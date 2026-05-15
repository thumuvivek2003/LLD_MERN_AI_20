import { SettlementModel } from "./settlement.model.js";

export async function createSettlement(data) {
  return SettlementModel.create(data);
}

export async function findSettlementsByGroup(groupId) {
  return SettlementModel.find({ groupId }).sort({ createdAt: -1 });
}

export async function findSettlementById(settlementId) {
  return SettlementModel.findOne({ settlementId });
}
