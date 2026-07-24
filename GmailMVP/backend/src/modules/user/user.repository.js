import { User } from './user.model.js';

/** Data-access layer for users. */

export function findAll() {
  return User.find().sort({ name: 1 }).exec();
}

export function findById(id) {
  return User.findById(id).exec();
}

export function findByIds(ids = []) {
  return User.find({ _id: { $in: ids } }).exec();
}

export function findByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase() }).exec();
}

export function count() {
  return User.estimatedDocumentCount().exec();
}

export function insertMany(docs) {
  return User.insertMany(docs);
}
