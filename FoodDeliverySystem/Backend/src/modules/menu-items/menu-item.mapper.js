import { buildMenuItemDto } from './menu-item.dto.js';

export const toMenuItemDto = (m) => (m ? buildMenuItemDto(m) : null);
export const toMenuItemDtoList = (list = []) => list.map(toMenuItemDto);
