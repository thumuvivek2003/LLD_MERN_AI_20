const KEY = 'cb_token';

export const tokenService = {
  get: () => localStorage.getItem(KEY),
  set: (token) => localStorage.setItem(KEY, token),
  remove: () => localStorage.removeItem(KEY),
};
