import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes.js';
import courseRoutes from './routes/course.routes.js';
import marksRoutes from './routes/marks.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;