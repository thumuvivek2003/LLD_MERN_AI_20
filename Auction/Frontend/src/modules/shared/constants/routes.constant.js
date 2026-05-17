export const ROUTES = Object.freeze({
  LOGIN: '/login',
  REGISTER: '/register',

  ADMIN_ROOT: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_AUCTIONS: '/admin/auctions',
  ADMIN_AUCTION_NEW: '/admin/auctions/new',
  ADMIN_AUCTION_DETAILS: (id) => `/admin/auctions/${id}`,
  ADMIN_ASSIGN: (id) => `/admin/auctions/${id}/assign`,
  ADMIN_ADD_ITEM: '/admin/items/new',
  ADMIN_USERS: '/admin/users',
  ADMIN_SCHEDULE: '/admin/schedule',
  ADMIN_REPORTS: '/admin/reports',

  MEMBER_ROOT: '/member',
  MEMBER_DASHBOARD: '/member',
  MEMBER_AUCTIONS: '/member/auctions',
  MEMBER_AUCTION_DETAILS: (id) => `/member/auctions/${id}`,
  MEMBER_PLACE_BID: (id) => `/member/auctions/${id}/bid`,
  MEMBER_WALLET: '/member/wallet',
  MEMBER_BIDS: '/member/bids',
  MEMBER_WINS: '/member/wins',
  MEMBER_PROFILE: '/member/profile',

  SPECTATOR_ROOT: '/spectator',
  SPECTATOR_HOME: '/spectator',
  SPECTATOR_AUCTION: (id) => `/spectator/auctions/${id}`,
});
