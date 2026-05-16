import { ROUTES } from '../shared/constants/routes.constants.js';
import { ACTOR_ROLES } from '../shared/constants/notification.constants.js';

// Sidebar driven from a dictionary — adding a page is one entry.
export function getSidebarItems(role) {
  if (role === ACTOR_ROLES.USER) {
    return [
      { label: 'Dashboard', icon: 'home', to: ROUTES.USER_DASHBOARD },
      { label: 'My Notifications', icon: 'bell', to: ROUTES.USER_NOTIFICATIONS },
      { label: 'Preferences', icon: 'settings', to: ROUTES.USER_PREFERENCES },
    ];
  }
  if (role === ACTOR_ROLES.ADMIN) {
    return [
      { label: 'Dashboard', icon: 'home', to: ROUTES.ADMIN_DASHBOARD },
      { label: 'All Notifications', icon: 'inbox', to: ROUTES.ADMIN_NOTIFICATIONS },
      { label: 'Retry Failed', icon: 'refresh', to: ROUTES.ADMIN_RETRY },
      { label: 'Analytics', icon: 'chart', to: ROUTES.ADMIN_ANALYTICS },
    ];
  }
  // SYSTEM
  return [
    { label: 'Templates', icon: 'file', to: ROUTES.TEMPLATES },
    { label: 'Send Notification', icon: 'send', to: ROUTES.COMPOSE_SEND },
    { label: 'Send Group', icon: 'users', to: ROUTES.COMPOSE_GROUP },
    { label: 'Queue Monitor', icon: 'cpu', to: ROUTES.SYSTEM_QUEUE },
    { label: 'Retry Queue', icon: 'rotate', to: ROUTES.SYSTEM_RETRY },
    { label: 'Delivery Logs', icon: 'clipboard', to: ROUTES.SYSTEM_LOGS },
  ];
}
