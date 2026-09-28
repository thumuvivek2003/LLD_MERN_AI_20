import { useCallback, useMemo } from 'react';
import { useUser } from '../context/UserContext.jsx';
import {
  fieldAccess,
  isFieldEditable,
  isFieldVisible,
  objectGrants,
  visibleFields,
} from '../utils/permission.js';
import { ROLE } from '../../shared/enums/role.enum.js';

/**
 * Permission-aware rendering hook. Pages use it to hide/disable actions;
 * DynamicForm and DataTable use it to drop hidden fields and lock read-only ones.
 */
export function usePermission(objectId) {
  const { me } = useUser();

  const grants = useMemo(() => objectGrants(me, objectId), [me, objectId]);

  const can = useCallback((action, oid = objectId) => objectGrants(me, oid)[action] === true, [me, objectId]);

  return useMemo(
    () => ({
      me,
      role: me?.role || null,
      isAdmin: me?.role === ROLE.PLATFORM_ADMIN,
      isSystem: me?.role === ROLE.SYSTEM,
      isBusiness: me?.role === ROLE.BUSINESS_USER,
      canRead: grants.read,
      canCreate: grants.create,
      canUpdate: grants.update,
      canDelete: grants.delete,
      can,
      fieldAccess: (fieldId, oid = objectId) => fieldAccess(me, oid, fieldId),
      isFieldVisible: (fieldId, oid = objectId) => isFieldVisible(me, oid, fieldId),
      isFieldEditable: (field, oid = objectId) => isFieldEditable(me, oid, field),
      visibleFields: (fields, oid = objectId) => visibleFields(me, oid, fields),
    }),
    [me, grants, can, objectId],
  );
}

export default usePermission;
