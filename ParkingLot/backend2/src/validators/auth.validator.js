export const registerValidator = (body) => {
  if (!body?.name) return 'name is required';
  if (!body?.email) return 'email is required';
  if (!body?.password || body.password.length < 6) return 'password must be at least 6 chars';
  return null;
};

export const loginValidator = (body) => {
  if (!body?.email) return 'email is required';
  if (!body?.password) return 'password is required';
  return null;
};
