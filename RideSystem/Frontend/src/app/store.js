// Lightweight pub/sub store for cross-component state without external deps.
// (Auth & Socket state live in context providers; this is for ad-hoc usage.)
const listeners = new Set();
let state = {};

export const store = {
  get: () => state,
  set: (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
  },
  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
