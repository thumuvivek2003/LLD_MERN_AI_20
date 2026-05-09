import { User } from './auth.model.js';

export const findByEmail = (email) => User.findOne({ email });
export const findById = (id) => User.findById(id);
export const createUser = (data) => User.create(data);
export const findAll = () => User.find().select('-password');
