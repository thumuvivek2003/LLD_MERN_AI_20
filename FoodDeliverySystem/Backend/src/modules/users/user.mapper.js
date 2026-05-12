import { buildUserDto } from './user.dto.js';

export const toUserDto = (user) => (user ? buildUserDto(user) : null);
export const toUserDtoList = (users = []) => users.map(toUserDto);
