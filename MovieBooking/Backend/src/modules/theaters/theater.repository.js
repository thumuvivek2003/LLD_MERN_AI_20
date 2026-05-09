import { Theater } from './theater.model.js';

export const findAll = (filter = {}) => Theater.find(filter);
export const findById = (id) => Theater.findById(id);
export const create = (data) => Theater.create(data);
export const update = (id, data) => Theater.findByIdAndUpdate(id, data, { new: true });
export const remove = (id) => Theater.findByIdAndDelete(id);
export const incrementScreens = (id) => Theater.findByIdAndUpdate(id, { $inc: { totalScreens: 1 } });
