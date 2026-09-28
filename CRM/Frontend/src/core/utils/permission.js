import { FIELD_ACCESS, OBJECT_PERMISSION } from '../../shared/enums/index.js';
import { ROLE } from '../../shared/enums/role.enum.js';

/**
 * Pure permission predicates over the `/api/me` payload:
 *   permissions.objects[objectId] = { read, create, update, delete }
 *   permissions.fields[objectId][fieldId] = HIDDEN | READ | WRITE
 *
 * Both maps support a `"*"` wildcard key as the fallback bucket, so a role can
 * declare a default and then override individual objects/fields.
 *
 * Platform Admin and System bypass object gates — they own the metadata layer.
 */
const WILDCARD = '*';

const isPrivileged = (role) => role === ROLE.PLATFORM_ADMIN || role === ROLE.SYSTEM;

const NO_GRANTS = { read: false, create: false, update: false, delete: false };
const ALL_GRANTS = { read: true, create: true, update: true, delete: true };

export const objectGrants = (me, objectId) => {
  if (!me) return NO_GRANTS;
  if (isPrivileged(me.role)) return ALL_GRANTS;

  const objects = me.permissions?.objects || {};
  const grants = objects[objectId] ?? objects[WILDCARD];
  if (!grants) return NO_GRANTS;
  return {
    read: Boolean(grants.read),
    create: Boolean(grants.create),
    update: Boolean(grants.update),
    delete: Boolean(grants.delete),
  };
};

export const canOnObject = (me, objectId, action = OBJECT_PERMISSION.READ) =>
  Boolean(objectGrants(me, objectId)[action]);

export const fieldAccess = (me, objectId, fieldId) => {
  if (!me) return FIELD_ACCESS.HIDDEN;
  if (isPrivileged(me.role)) return FIELD_ACCESS.WRITE;

  const fields = me.permissions?.fields || {};
  const forObject = fields[objectId] || {};
  const fallback = fields[WILDCARD] || {};

  return (
    forObject[fieldId] ??
    forObject[WILDCARD] ??
    fallback[fieldId] ??
    fallback[WILDCARD] ??
    FIELD_ACCESS.WRITE
  );
};

export const isFieldVisible = (me, objectId, fieldId) =>
  fieldAccess(me, objectId, fieldId) !== FIELD_ACCESS.HIDDEN;

export const isFieldWritable = (me, objectId, fieldId) =>
  fieldAccess(me, objectId, fieldId) === FIELD_ACCESS.WRITE;

/** Filters an object's `fields[]` down to what this user may see. */
export const visibleFields = (me, objectId, fields = []) =>
  fields.filter((field) => isFieldVisible(me, objectId, field.fieldId));

/**
 * Effective write state for a field on a form: metadata `readOnly` and
 * field-level permission both veto editing.
 */
export const isFieldEditable = (me, objectId, field) =>
  !field.readOnly && isFieldWritable(me, objectId, field.fieldId);

/* ------------------------------------------------------------------ *
 * Admin-side editors read a raw `GET /permissions` matrix rather than
 * `/me`, but must resolve the same wildcard fallbacks so the toggles
 * show the effective grant instead of a misleading "off".
 * ------------------------------------------------------------------ */

export const grantsFromMatrix = (matrix, objectId) => {
  const objects = matrix?.objects || {};
  const grants = objects[objectId] ?? objects[WILDCARD] ?? {};
  return {
    read: Boolean(grants.read),
    create: Boolean(grants.create),
    update: Boolean(grants.update),
    delete: Boolean(grants.delete),
  };
};

export const accessFromMatrix = (matrix, objectId, fieldId) => {
  const fields = matrix?.fields || {};
  const forObject = fields[objectId] || {};
  const fallback = fields[WILDCARD] || {};
  return (
    forObject[fieldId] ??
    forObject[WILDCARD] ??
    fallback[fieldId] ??
    fallback[WILDCARD] ??
    FIELD_ACCESS.WRITE
  );
};
