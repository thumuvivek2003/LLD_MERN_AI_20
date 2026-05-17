// Per-auction async mutex. Serialises bid attempts on a single auctionId
// inside one node process so optimistic-locking retries stay sane.
// For multi-node, swap this for Redis/Redlock — interface stays the same.

class AuctionLockManager {
  constructor() {
    this.chains = new Map(); // auctionId -> Promise representing the current tail
  }

  async lock(auctionId, criticalFn) {
    const prev = this.chains.get(auctionId) || Promise.resolve();

    let release;
    const released = new Promise((res) => (release = res));

    // chain *after* prev so callers queue in FIFO order
    const ourTurn = prev.then(() => released);
    this.chains.set(auctionId, ourTurn);

    await prev;
    try {
      return await criticalFn();
    } finally {
      release();
      // if no one queued behind us, clean up to avoid map growth
      if (this.chains.get(auctionId) === ourTurn) {
        this.chains.delete(auctionId);
      }
    }
  }

  // alias for symmetry; with the closure-based approach the release is automatic.
  unlock(_auctionId) {}
}

export const auctionLockManager = new AuctionLockManager();
