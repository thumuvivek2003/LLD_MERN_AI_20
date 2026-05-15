export class SplitStrategy {
  calculateShares(amount, participants, input) {
    throw new Error("calculateShares() must be implemented by subclass");
  }
}
