/**
 * Strategy pattern base. Each strategy knows how to build the query params
 * for a particular search type and can locally filter results as a fallback
 * (useful before the backend is live, and for snappy client-side refinement).
 */
export class SearchStrategy {
  get type() {
    return 'all';
  }
  get label() {
    return 'All';
  }

  buildParams(userId, q) {
    return { userId, q, type: this.type };
  }

  // Local predicate fallback. `vm` is a mail view model.
  matches(vm, q) {
    if (!q) return true;
    const term = q.toLowerCase();
    return this.haystack(vm).toLowerCase().includes(term);
  }

  haystack(vm) {
    return [
      vm.sender?.name,
      vm.sender?.email,
      vm.receiverNames,
      vm.subject,
      vm.body,
    ]
      .filter(Boolean)
      .join(' ');
  }
}
