const KEY = 'fd_token';
const USER_KEY = 'fd_user';

export const setAccessToken = (token) => localStorage.setItem(KEY, token);
export const getAccessToken = () => localStorage.getItem(KEY);
export const clearAccessToken = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER_KEY);
};

export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
  catch { return null; }
};
