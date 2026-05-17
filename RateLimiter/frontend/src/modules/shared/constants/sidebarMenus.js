import { ROUTES } from './routes.js';

export const ADMIN_MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid', to: ROUTES.ADMIN },
  {
    key: 'strategies',
    label: 'Strategies',
    icon: 'layers',
    to: ROUTES.ADMIN_STRATEGIES,
  },
  {
    key: 'config',
    label: 'Configuration',
    icon: 'sliders',
    to: ROUTES.ADMIN_CONFIG,
  },
  {
    key: 'users',
    label: 'Users',
    icon: 'users',
    to: ROUTES.ADMIN_CLIENTS,
  },
];

export const CLIENT_MENU = [
  {
    key: 'dashboard',
    label: 'My Dashboard',
    icon: 'grid',
    to: ROUTES.CLIENT,
  },
  {
    key: 'console',
    label: 'API Console',
    icon: 'terminal',
    to: ROUTES.CLIENT_CONSOLE,
  },
  {
    key: 'history',
    label: 'Usage History',
    icon: 'activity',
    to: ROUTES.CLIENT_HISTORY,
  },
];
