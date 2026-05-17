import { ClientState } from './ClientState.js';

class StateManager {
  constructor() {
    this.store = new Map();
  }

  getClientState(clientId) {
    let state = this.store.get(clientId);
    if (!state) {
      state = new ClientState(clientId);
      this.store.set(clientId, state);
    }
    return state;
  }

  updateClientState(clientId, state) {
    this.store.set(clientId, state);
  }

  resetClient(clientId) {
    const fresh = new ClientState(clientId);
    this.store.set(clientId, fresh);
    return fresh;
  }

  removeClient(clientId) {
    this.store.delete(clientId);
  }

  allEntries() {
    return Array.from(this.store.entries());
  }

  size() {
    return this.store.size;
  }
}

export const rateLimiterStateManager = new StateManager();
