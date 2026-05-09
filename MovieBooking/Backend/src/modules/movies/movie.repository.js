import { Movie } from './movie.model.js';

export const findAll = (filter = {}) => Movie.find(filter);
export const findById = (id) => Movie.findById(id);
export const search = (q) => Movie.find({ $text: { $search: q }, isActive: true });
export const create = (data) => Movie.create(data);
export const update = (id, data) => Movie.findByIdAndUpdate(id, data, { new: true });
export const remove = (id) => Movie.findByIdAndDelete(id);
