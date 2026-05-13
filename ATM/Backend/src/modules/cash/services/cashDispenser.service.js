import { GreedyDispenseStrategy } from "../strategies/GreedyDispenseStrategy.js";
import * as cashRepo from "../repositories/cash.repository.js";
import * as inventoryService from "./cashInventory.service.js";
import { InsufficientATMCashError } from "../../../core/errors/InsufficientATMCashError.js";

const strategy = new GreedyDispenseStrategy();

export async function prepareCash(amount) {
  await inventoryService.validateCashAvailability(amount);
  const inv = await cashRepo.getInventory();
  const { remaining, breakdown, inventoryAfter } = strategy.dispense(amount, inv.notes);
  if (remaining > 0) throw new InsufficientATMCashError("Cannot break amount with available notes");
  return { breakdown, inventoryAfter, total: amount };
}

export async function collectCash(inventoryAfter) {
  return inventoryService.deductCash(inventoryAfter);
}

export async function rollbackCash(breakdown) {
  return inventoryService.addCash(breakdown);
}
