// core/feed/ordering.service.js — orderUsers()
// Implements the exact WhatsApp ordering rule (design notes Step 5 / Step 11):
//   1. Groups with unseen statuses first, then fully-seen groups.
//   2. Within each bucket, sort by latest status time (newest first).
// The bucket is decided by the State object, not inline conditionals.
import { createState } from './states/state.factory.js';

class OrderingService {
  orderUsers(groups) {
    return [...groups].sort((a, b) => {
      const pa = createState(a.unseenCount).priority();
      const pb = createState(b.unseenCount).priority();
      if (pa !== pb) return pa - pb; // unseen bucket before seen bucket
      // newest latest-status first within the bucket
      return new Date(b.latestStatusAt).getTime() - new Date(a.latestStatusAt).getTime();
    });
  }
}

export const orderingService = new OrderingService();
