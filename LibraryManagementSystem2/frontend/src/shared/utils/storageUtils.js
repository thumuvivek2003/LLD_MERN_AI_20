export const getStorageItem = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};
export const setStorageItem = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const removeStorageItem = (key) => localStorage.removeItem(key);
