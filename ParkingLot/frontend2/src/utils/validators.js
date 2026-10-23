const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLATE_RX = /^[A-Z0-9-]{4,12}$/i;

export const isEmail = (value) => EMAIL_RX.test(String(value || '').trim());

export const isPlate = (value) => PLATE_RX.test(String(value || '').trim());

export const required = (value) => value !== undefined && value !== null && String(value).trim() !== '';

export const minLength = (value, len) => String(value || '').length >= len;
