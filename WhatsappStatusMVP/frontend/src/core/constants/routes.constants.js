// core/constants/routes.constants.js — single source of route paths.
export const ROUTES = Object.freeze({
  LOGIN: '/login',
  FEED: '/',
  CREATE: '/create',
  MY_STATUS: '/me',
  VIEWER: '/view/:userId', // story viewer for one friend
  MY_VIEWERS: '/me/:statusId/viewers',
});

export const toViewer = (userId) => `/view/${userId}`;
export const toMyViewers = (statusId) => `/me/${statusId}/viewers`;
