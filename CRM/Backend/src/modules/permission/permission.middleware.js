import { PermissionError } from '../../core/exceptions/permission.error.js';

/**
 * Object-level RBAC as route middleware — the check happens before any handler
 * runs, so services never repeat it.
 *
 * `objectIdFrom` is a resolver because the objectId lives in `params.oid` on
 * record routes, in the body on `/search`, and in the query string on `/indexes`.
 */
export function requirePermission(action, objectIdFrom = (req) => req.params.oid) {
  return async (req, _res, next) => {
    try {
      if (!req.actor) throw new PermissionError('Missing x-user-id header');
      const objectId = objectIdFrom(req);
      if (!objectId) return next();

      const allowed = await req.container.permissionService.can(req.actor.roleId, objectId, action);
      if (!allowed) {
        throw new PermissionError(`Role '${req.actor.roleId}' cannot ${action} '${objectId}'`);
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

/** Guards the metadata-authoring surface: only roles granted `*` object rights. */
export function requireMetadataAdmin(action = 'update') {
  return async (req, _res, next) => {
    try {
      if (!req.actor) throw new PermissionError('Missing x-user-id header');
      const perms = await req.container.permissionService.objectPermissions(req.actor.roleId, '*');
      if (!perms[action]) throw new PermissionError(`Role '${req.actor.roleId}' cannot ${action} platform metadata`);
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
