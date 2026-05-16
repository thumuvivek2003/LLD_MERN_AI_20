import { useNotificationComposerStore } from '../state/notificationComposer.store.js';

// Thin wrapper for ergonomics. The composer store is the source of truth.
export function useNotificationComposer() {
  return useNotificationComposerStore();
}
