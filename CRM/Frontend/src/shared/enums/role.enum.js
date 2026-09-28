export const ROLE = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  BUSINESS_USER: 'BUSINESS_USER',
  SYSTEM: 'SYSTEM',
};

export const ROLE_LABEL = {
  PLATFORM_ADMIN: 'Platform Administrator',
  BUSINESS_USER: 'Business User',
  SYSTEM: 'System Daemon',
};

/** Landing route for each role — used by the user switcher and RoleRoute. */
export const ROLE_HOME = {
  PLATFORM_ADMIN: '/admin',
  BUSINESS_USER: '/business',
  SYSTEM: '/system',
};

/** Which actor console a role is allowed into. */
export const ROLE_ACTOR = {
  PLATFORM_ADMIN: 'admin',
  BUSINESS_USER: 'business',
  SYSTEM: 'system',
};
