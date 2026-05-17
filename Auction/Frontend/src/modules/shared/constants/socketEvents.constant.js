export const SOCKET_EVENTS = Object.freeze({
  // client -> server
  JOIN_AUCTION: 'auction:join',
  LEAVE_AUCTION: 'auction:leave',

  // server -> client
  AUCTION_STARTED: 'auction:started',
  AUCTION_CLOSED: 'auction:closed',
  BID_NEW: 'bid:new',
});

export const AUCTION_STATUS = Object.freeze({
  SCHEDULED: 'SCHEDULED',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
});

export const INCREMENT_TYPE = Object.freeze({
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE',
});
