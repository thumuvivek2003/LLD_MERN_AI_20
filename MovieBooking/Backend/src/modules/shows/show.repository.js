import { Show } from './show.model.js';

export const findAll = (filter = {}) => Show.find(filter).populate('movieId', 'title posterUrl duration').populate('screenId', 'name').populate('theaterId', 'name city');
export const findById = (id) => Show.findById(id).populate('movieId').populate('screenId').populate('theaterId');
export const findByMovie = (movieId) => Show.find({ movieId, status: 'active' }).populate('theaterId', 'name city').populate('screenId', 'name');
export const create = (data) => Show.create(data);
export const update = (id, data) => Show.findByIdAndUpdate(id, data, { new: true });
export const remove = (id) => Show.findByIdAndDelete(id);
