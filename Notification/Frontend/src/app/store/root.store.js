// Convenience root re-exports. Components can either import this aggregate
// store or the individual module stores — both work.
import { useCurrentActorStore } from '../../shared/state/currentActor.store.js';
import { useUserNotificationStore } from '../../modules/user/state/userNotification.store.js';
import { useAdminDashboardStore } from '../../modules/admin/state/adminDashboard.store.js';
import { useTemplateStore } from '../../modules/template/state/template.store.js';
import { useNotificationComposerStore } from '../../modules/notification/state/notificationComposer.store.js';

export function createRootStore() {
  return {
    currentActor: useCurrentActorStore,
    userNotifications: useUserNotificationStore,
    adminDashboard: useAdminDashboardStore,
    templates: useTemplateStore,
    composer: useNotificationComposerStore,
  };
}

export const rootStore = createRootStore();
