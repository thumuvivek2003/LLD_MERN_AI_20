import * as repo from './movie.repository.js';

export const getMovies = async ({ search, city } = {}) => {
  if (search) return repo.search(search);
  return repo.findAll({ isActive: true });
};

export const getMovie = async (id) => {
  const movie = await repo.findById(id);
  if (!movie) throw Object.assign(new Error('Movie not found'), { statusCode: 404 });
  return movie;
};

export const createMovie = (data) => repo.create(data);

export const updateMovie = async (id, data) => {
  const movie = await repo.update(id, data);
  if (!movie) throw Object.assign(new Error('Movie not found'), { statusCode: 404 });
  return movie;
};

export const deleteMovie = (id) => repo.remove(id);
