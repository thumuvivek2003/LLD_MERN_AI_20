import { Payment } from './payment.model.js';

export const findById = (id) => Payment.findById(id);
export const create = (data) => Payment.create(data);
export const update = (id, data) => Payment.findByIdAndUpdate(id, data, { new: true });
