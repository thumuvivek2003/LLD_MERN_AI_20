// config/database.js — connectMongo() [Singleton]
// One Mongo connection for the whole process. Repeated calls reuse it.
import mongoose from 'mongoose';
import { env } from './env.js';

let connectionPromise = null;

export function connectMongo() {
  if (connectionPromise) return connectionPromise;

  mongoose.set('strictQuery', true);
  connectionPromise = mongoose
    .connect(env.mongoUri)
    .then((conn) => {
      console.log(`[db] connected → ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    })
    .catch((err) => {
      connectionPromise = null; // allow retry on failure
      throw err;
    });

  return connectionPromise;
}
