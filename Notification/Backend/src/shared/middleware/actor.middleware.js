/**
 * MVP "auth" — read x-actor-id / x-actor-role headers.
 * If missing, default to the seeded admin so dev/Postman works without setup.
 */
export function actorContext(req, _res, next) {
  const id = req.header('x-actor-id') || 'u_admin';
  const role = (req.header('x-actor-role') || 'ADMIN').toUpperCase();
  req.actor = { id, role };
  next();
}
