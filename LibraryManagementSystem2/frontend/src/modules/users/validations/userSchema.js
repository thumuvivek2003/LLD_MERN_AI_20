export const validateUser = ({ name, email, password }) => {
  const errors = {};
  if (!name) errors.name = 'Name is required';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email required';
  if (!password || password.length < 6) errors.password = 'Minimum 6 characters';
  return errors;
};
