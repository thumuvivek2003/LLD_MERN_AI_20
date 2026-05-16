import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACTOR_ROLES } from '../constants/notification.constants.js';

// Singleton actor store — holds selected actor role + chosen userId.
// The axios client subscribes to this for x-actor-id / x-actor-role headers.
export const useCurrentActorStore = create(
  persist(
    (set) => ({
      role: ACTOR_ROLES.USER,
      userId: 'u1',
      setActor: (role, userId) => set({ role, userId }),
      setRole: (role) => set({ role }),
      setUserId: (userId) => set({ userId }),
    }),
    { name: 'ns:current-actor' },
  ),
);

// Convenience read for non-React code (e.g. axios interceptors).
export function getCurrentActor() {
  const { role, userId } = useCurrentActorStore.getState();
  return { role, userId };
}
