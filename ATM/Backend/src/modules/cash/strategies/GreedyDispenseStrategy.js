import { CashDispenseStrategy } from "./CashDispenseStrategy.js";
import { Note2000Handler } from "../chain/Note2000Handler.js";
import { Note500Handler } from "../chain/Note500Handler.js";
import { Note200Handler } from "../chain/Note200Handler.js";
import { Note100Handler } from "../chain/Note100Handler.js";

export class GreedyDispenseStrategy extends CashDispenseStrategy {
  dispense(amount, inventory) {
    const h2000 = new Note2000Handler();
    const h500 = new Note500Handler();
    const h200 = new Note200Handler();
    const h100 = new Note100Handler();
    h2000.setNext(h500).setNext(h200).setNext(h100);

    const workingInventory = { ...inventory };
    const breakdown = { 2000: 0, 500: 0, 200: 0, 100: 0 };
    const { remaining, breakdown: result } = h2000.handle(amount, workingInventory, breakdown);

    return { remaining, breakdown: result, inventoryAfter: workingInventory };
  }
}
