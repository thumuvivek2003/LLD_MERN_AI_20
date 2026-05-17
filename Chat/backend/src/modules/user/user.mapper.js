/**
 * Public user DTO matching API_CONTRACT.md.
 */
export function toUserResponse(user) {
  if (!user) return null;
  return {
    id: String(user._id || user.id),
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    isOnline: !!user.isOnline,
    lastSeen: user.lastSeen ? new Date(user.lastSeen).toISOString() : null,
  };
}

/**
 * Extended view used by admin endpoints.
 */
export function toAdminUserResponse(user) {
  if (!user) return null;
  return {
    ...toUserResponse(user),
    isBlocked: !!user.isBlocked,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };
}

/**
 * Member view used inside Chat responses.
 */
export function toMemberResponse(user, role) {
  if (!user) return null;
  return {
    userId: String(user._id || user.id),
    name: user.name,
    mobile: user.mobile,
    role: role || 'MEMBER',
    isOnline: !!user.isOnline,
    lastSeen: user.lastSeen ? new Date(user.lastSeen).toISOString() : null,
  };
}
