/**
 * Map a User document (or populated ref) to the shared UserDTO shape.
 * @param {object} user mongoose User doc or plain object
 * @returns {{id:string,name:string,email:string,avatarColor:string}|null}
 */
export function toUserDTO(user) {
  if (!user) return null;
  return {
    id: String(user._id ?? user.id),
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
  };
}

/**
 * @param {object[]} users
 * @returns {object[]}
 */
export function toUserDTOList(users = []) {
  return users.map(toUserDTO).filter(Boolean);
}
