// Centralized route paths. Keeps router + sidebar in sync.
export const ROUTES = {
  // User
  USER_DASHBOARD: '/user',
  USER_NOTIFICATIONS: '/user/notifications',
  USER_PREFERENCES: '/user/preferences',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_NOTIFICATION_DETAILS: '/admin/notifications/:id',
  ADMIN_RETRY: '/admin/retry',
  ADMIN_ANALYTICS: '/admin/analytics',

  // Template
  TEMPLATES: '/templates',
  TEMPLATE_NEW: '/templates/new',
  TEMPLATE_EDITOR: '/templates/:id',
  TEMPLATE_VERSIONS: '/templates/:id/versions',

  // Notification (compose)
  COMPOSE_SEND: '/compose/send',
  COMPOSE_GROUP: '/compose/group',
  COMPOSE_REVIEW: '/compose/review',

  // System
  SYSTEM_QUEUE: '/system/queue',
  SYSTEM_RETRY: '/system/retry',
  SYSTEM_LOGS: '/system/logs',
};
