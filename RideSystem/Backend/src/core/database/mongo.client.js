import mongoose from 'mongoose';

export const mongoClient = {
  get connection() {
    return mongoose.connection;
  },
  get readyState() {
    return mongoose.connection.readyState;
  },
};
