import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import bookRoutes from './routes/books.routes.js';
import transactionRoutes from './routes/transactions.routes.js';
import reservationRoutes from './routes/reservations.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const loadMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

export const loadRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/reservations', reservationRoutes);
  
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Library API is running' });
  });
};

export const loadErrorHandler = (app) => {
  app.use(errorHandler);
};

const createApp = () => {
  const app = express();
  
  loadMiddlewares(app);
  loadRoutes(app);
  loadErrorHandler(app);
  
  return app;
};

export default createApp;