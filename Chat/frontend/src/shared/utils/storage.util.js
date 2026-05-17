/**
 * Tiny localStorage wrapper with JSON support.
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('storage.set failed', err);
  }
}

export function getStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error('storage.get failed', err);
    return fallback;
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('storage.remove failed', err);
  }
}
