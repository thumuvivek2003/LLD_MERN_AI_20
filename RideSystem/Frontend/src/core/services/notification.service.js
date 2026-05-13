// In-app notification publisher backed by simple pub/sub.
const subs = new Set();

export const notificationService = {
  push: (n) => {
    const note = { id: Date.now() + Math.random(), ts: Date.now(), ...n };
    subs.forEach((fn) => fn(note));
  },
  subscribe: (fn) => {
    subs.add(fn);
    return () => subs.delete(fn);
  },
};
