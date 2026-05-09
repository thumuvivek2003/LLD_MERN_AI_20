export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => password && password.length >= 6;

export const validateBookData = ({ title, author, isbn, totalCopies }) => {
  if (!title || !author || !isbn) throw new Error('title, author, and isbn are required');
  if (totalCopies < 1) throw new Error('totalCopies must be at least 1');
};
