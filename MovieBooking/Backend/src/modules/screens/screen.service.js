import * as repo from './screen.repository.js';
import { incrementScreens } from '../theaters/theater.repository.js';

export const getScreensByTheater = (theaterId) => repo.findByTheater(theaterId);

export const getScreen = async (id) => {
  const s = await repo.findById(id);
  if (!s) throw Object.assign(new Error('Screen not found'), { statusCode: 404 });
  return s;
};

export const createScreen = async (data) => {
  const screen = await repo.create(data);
  await incrementScreens(data.theaterId);
  return screen;
};

export const updateScreen = async (id, data) => {
  const s = await repo.update(id, data);
  if (!s) throw Object.assign(new Error('Screen not found'), { statusCode: 404 });
  return s;
};

export const deleteScreen = (id) => repo.remove(id);

export const getLayout = async (screenId) => {
  const screen = await repo.findById(screenId);
  if (!screen) throw Object.assign(new Error('Screen not found'), { statusCode: 404 });
  return screen.seatLayout;
};

export const updateLayout = async (screenId, layout) => {
  return repo.update(screenId, { seatLayout: layout });
};
