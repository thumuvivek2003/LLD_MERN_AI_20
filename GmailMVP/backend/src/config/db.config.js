import mongoose from 'mongoose';

/**
 * Connect to MongoDB. Throws on failure so the caller can decide whether to
 * exit or keep the process alive (we choose not to crash-loop).
 * @param {string} uri
 * @returns {Promise<typeof mongoose>}
 */
export async function connectMongoDB(uri) {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('[db] MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose;
}

export async function disconnectMongoDB() {
  await mongoose.disconnect();
}
