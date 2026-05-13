export class DispenseHandler {
  constructor(denomination) {
    this.denomination = denomination;
    this.next = null;
  }

  setNext(handler) {
    this.next = handler;
    return handler;
  }

  handle(amount, inventory, breakdown) {
    const available = inventory[this.denomination] ?? 0;
    if (amount >= this.denomination && available > 0) {
      const need = Math.floor(amount / this.denomination);
      const take = Math.min(need, available);
      breakdown[this.denomination] = (breakdown[this.denomination] ?? 0) + take;
      inventory[this.denomination] = available - take;
      amount -= take * this.denomination;
    }
    if (amount === 0) return { remaining: 0, breakdown };
    if (this.next) return this.next.handle(amount, inventory, breakdown);
    return { remaining: amount, breakdown };
  }
}
