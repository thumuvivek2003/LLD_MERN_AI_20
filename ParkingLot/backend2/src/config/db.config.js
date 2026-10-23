import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri);
  return mongoose.connection;
};
