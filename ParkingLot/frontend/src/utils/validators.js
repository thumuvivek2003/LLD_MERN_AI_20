export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
export const minLength = (value, n) => (value || '').length >= n;
export const required = (value) => value !== undefined && value !== null && String(value).trim() !== '';
