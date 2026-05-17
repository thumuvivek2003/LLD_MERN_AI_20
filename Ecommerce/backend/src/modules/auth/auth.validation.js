export function registerSchema(body) {
  if (!body.name || body.name.length < 2) return 'name is required';
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) return 'valid email is required';
  if (!body.password || body.password.length < 6) return 'password must be at least 6 chars';
  if (body.role && !['customer', 'admin'].includes(body.role)) return 'invalid role';
  return null;
}

export function loginSchema(body) {
  if (!body.email) return 'email is required';
  if (!body.password) return 'password is required';
  return null;
}
