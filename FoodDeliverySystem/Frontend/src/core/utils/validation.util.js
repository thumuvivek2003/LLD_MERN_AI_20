export const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email || '');
export const validatePassword = (pwd) => (pwd || '').length >= 6;
