import { CashInventoryModel } from "../models/CashInventory.model.js";

const DEFAULT_ATM_ID = "ATM-1";

export async function getInventory(atmId = DEFAULT_ATM_ID) {
  let inv = await CashInventoryModel.findOne({ atmId });
  if (!inv) {
    inv = await CashInventoryModel.create({ atmId, notes: { 2000: 0, 500: 0, 200: 0, 100: 0 } });
  }
  return inv;
}

export async function updateInventory(notes, atmId = DEFAULT_ATM_ID) {
  return CashInventoryModel.findOneAndUpdate(
    { atmId },
    { notes },
    { new: true, upsert: true }
  );
}
