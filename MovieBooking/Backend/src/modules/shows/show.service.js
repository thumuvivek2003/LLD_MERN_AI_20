import * as repo from './show.repository.js';

export const getShows = (query = {}) => repo.findAll(query);

export const getShow = async (id) => {
  const show = await repo.findById(id);
  if (!show) throw Object.assign(new Error('Show not found'), { statusCode: 404 });
  return show;
};

export const getShowsByMovie = (movieId) => repo.findByMovie(movieId);

export const createShow = (data) => repo.create(data);

export const updateShow = async (id, data) => {
  const show = await repo.update(id, data);
  if (!show) throw Object.assign(new Error('Show not found'), { statusCode: 404 });
  return show;
};

export const deleteShow = (id) => repo.remove(id);
