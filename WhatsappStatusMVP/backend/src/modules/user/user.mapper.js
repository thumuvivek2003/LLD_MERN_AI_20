// modules/user/user.mapper.js — toUserResponse()
// Converts a Mongo document into the stable API shape the frontend expects.
export function toUserResponse(user) {
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    avatar: user.avatar || '',
  };
}

export function toUserResponseList(users) {
  return users.map(toUserResponse);
}
