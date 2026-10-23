import createApp from './app.js';
import { connectDB } from './config/db.js';
import { getConfig } from './config/env.js';
import { startReservationExpiryJob } from './jobs/reservationExpiry.job.js';

export const initJobs = () => {
  // startReservationExpiryJob();
};

export const startServer = async () => {
  try {
    const config = getConfig();
    
    await connectDB();
    console.log('Database connected successfully');
    
    const app = createApp();
    
    initJobs();
    
    const PORT = config.port || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();