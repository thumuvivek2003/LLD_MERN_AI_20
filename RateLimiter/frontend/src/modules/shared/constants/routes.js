export const ROUTES = {
  LOGIN: '/login',
  ADMIN: '/admin',
  ADMIN_STRATEGIES: '/admin/strategies',
  ADMIN_CONFIG: '/admin/config',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_CLIENT_DETAILS: '/admin/clients/:clientId',
  CLIENT: '/client',
  CLIENT_CONSOLE: '/client/console',
  CLIENT_HISTORY: '/client/history',
};

export function clientDetailsPath(clientId) {
  return `/admin/clients/${clientId}`;
}
