const KEY = 'cb_user';

export const storageService = {
  getUser: () => JSON.parse(localStorage.getItem(KEY) || 'null'),
  setUser: (user) => localStorage.setItem(KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(KEY),
  clear: () => { localStorage.removeItem(KEY); localStorage.removeItem('cb_token'); },
};
