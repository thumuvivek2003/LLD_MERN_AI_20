import * as cashRepo from "../repositories/cash.repository.js";
import { InsufficientATMCashError } from "../../../core/errors/InsufficientATMCashError.js";

export async function getInventory() {
  const inv = await cashRepo.getInventory();
  return inv.notes;
}

export async function validateCashAvailability(amount) {
  const inv = await cashRepo.getInventory();
  const total =
    (inv.notes[2000] || 0) * 2000 +
    (inv.notes[500] || 0) * 500 +
    (inv.notes[200] || 0) * 200 +
    (inv.notes[100] || 0) * 100;
  if (total < amount) throw new InsufficientATMCashError();
  return true;
}

export async function deductCash(newNotes) {
  return cashRepo.updateInventory(newNotes);
}

export async function addCash(addition) {
  const inv = await cashRepo.getInventory();
  const notes = { ...inv.notes };
  for (const k of Object.keys(addition)) {
    notes[k] = (notes[k] || 0) + addition[k];
  }
  return cashRepo.updateInventory(notes);
}
