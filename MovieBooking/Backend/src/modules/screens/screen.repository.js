import { Screen } from './screen.model.js';

export const findAll = (filter = {}) => Screen.find(filter).populate('theaterId', 'name city');
export const findById = (id) => Screen.findById(id).populate('theaterId', 'name city');
export const findByTheater = (theaterId) => Screen.find({ theaterId });
export const create = (data) => Screen.create(data);
export const update = (id, data) => Screen.findByIdAndUpdate(id, data, { new: true });
export const remove = (id) => Screen.findByIdAndDelete(id);
