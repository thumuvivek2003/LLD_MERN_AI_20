import { toUserDTO } from '../../auth/dtos/auth.dto.js';

export function toUserList(users) {
  return users.map((u) => toUserDTO(u));
}
