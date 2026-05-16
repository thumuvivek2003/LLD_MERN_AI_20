import { ROUTES } from '../shared/constants/routes.constants.js';
import { ACTOR_ROLES } from '../shared/constants/notification.constants.js';

// Single dictionary describing what each actor can land on by default.
export function getAppRoutes() {
  return {
    [ACTOR_ROLES.USER]: ROUTES.USER_DASHBOARD,
    [ACTOR_ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
    [ACTOR_ROLES.SYSTEM]: ROUTES.TEMPLATES,
  };
}
