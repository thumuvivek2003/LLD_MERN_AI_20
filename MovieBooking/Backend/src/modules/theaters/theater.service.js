import * as repo from './theater.repository.js';

export const getTheaters = (query = {}) => repo.findAll(query);

export const getTheater = async (id) => {
  const t = await repo.findById(id);
  if (!t) throw Object.assign(new Error('Theater not found'), { statusCode: 404 });
  return t;
};

export const createTheater = (data) => repo.create(data);

export const updateTheater = async (id, data) => {
  const t = await repo.update(id, data);
  if (!t) throw Object.assign(new Error('Theater not found'), { statusCode: 404 });
  return t;
};

export const deleteTheater = (id) => repo.remove(id);
