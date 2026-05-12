import { toUserDto } from '../users/user.mapper.js';

export const buildAuthResponseDto = (user, token) => ({
  token,
  user: toUserDto(user),
});
