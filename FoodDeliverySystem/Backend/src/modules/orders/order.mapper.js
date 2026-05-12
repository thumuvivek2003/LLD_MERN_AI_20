import { buildOrderDto } from './order.dto.js';

export const toOrderDto = (o) => (o ? buildOrderDto(o) : null);
export const toOrderDtoList = (list = []) => list.map(toOrderDto);
