export const Routes = Object.freeze({
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin',
    LOTS: '/admin/lots',
    FLOORS: '/admin/floors',
    SLOTS: '/admin/slots',
    USERS: '/admin/users',
    PRICING: '/admin/pricing',
    PAYMENTS: '/admin/payments',
  },
  ENTRY: {
    NEW: '/entry/new',
    ALLOCATE: '/entry/allocate',
    TICKET: '/entry/ticket',
  },
  EXIT: {
    SEARCH: '/exit/search',
    FARE: '/exit/fare',
    SUCCESS: '/exit/success',
  },
});
