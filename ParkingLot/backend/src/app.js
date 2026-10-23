import express from 'express';
import { loggerMiddleware } from './shared/middlewares/logger.middleware.js';
import { errorMiddleware } from './shared/middlewares/error.middleware.js';
import { authRoutes } from './modules/auth/routes/auth.routes.js';
import { parkingLotRoutes } from './modules/parking/routes/parking-lot.routes.js';
import { slotRoutes } from './modules/parking/routes/slot.routes.js';
import { pricingRoutes } from './modules/parking/routes/pricing.routes.js';
import { entryRoutes } from './modules/parking/routes/entry.routes.js';
import { exitRoutes } from './modules/parking/routes/exit.routes.js';

export const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use('/auth', authRoutes);
app.use('/parking-lots', parkingLotRoutes);
app.use('/slots', slotRoutes);
app.use('/pricing', pricingRoutes);
app.use('/entry', entryRoutes);
app.use('/exit', exitRoutes);

app.use(errorMiddleware);
