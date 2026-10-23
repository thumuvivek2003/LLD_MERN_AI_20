import express from 'express';

import { errorMiddleware } from './middlewares/error.middleware.js';

import { UserRepository } from './repositories/UserRepository.js';
import { ParkingLotRepository } from './repositories/ParkingLotRepository.js';
import { ParkingSlotRepository } from './repositories/ParkingSlotRepository.js';
import { TicketRepository } from './repositories/TicketRepository.js';
import { PaymentRepository } from './repositories/PaymentRepository.js';

import { AuthService } from './services/AuthService.js';
import { SlotService } from './services/SlotService.js';
import { TicketService } from './services/TicketService.js';
import { PricingService } from './services/PricingService.js';
import { EntryService } from './services/EntryService.js';
import { ExitService } from './services/ExitService.js';
import { ParkingLotService } from './services/ParkingLotService.js';
import { AdminService } from './services/AdminService.js';

import { AuthController } from './controllers/AuthController.js';
import { EntryController } from './controllers/EntryController.js';
import { ExitController } from './controllers/ExitController.js';
import { ParkingLotController } from './controllers/ParkingLotController.js';
import { SlotController } from './controllers/SlotController.js';
import { AdminController } from './controllers/AdminController.js';

import { authRoutes } from './routes/auth.routes.js';
import { entryRoutes } from './routes/entry.routes.js';
import { exitRoutes } from './routes/exit.routes.js';
import { parkingRoutes } from './routes/parking.routes.js';
import { slotRoutes } from './routes/slot.routes.js';
import { adminRoutes } from './routes/admin.routes.js';

export const buildApp = () => {
  const userRepository = new UserRepository();
  const parkingLotRepository = new ParkingLotRepository();
  const slotRepository = new ParkingSlotRepository();
  const ticketRepository = new TicketRepository();
  const paymentRepository = new PaymentRepository();

  const authService = new AuthService(userRepository);
  const slotService = new SlotService(slotRepository);
  const ticketService = new TicketService(ticketRepository);
  const pricingService = new PricingService();
  const parkingLotService = new ParkingLotService(parkingLotRepository);
  const entryService = new EntryService({ slotRepository, slotService, ticketService });
  const exitService = new ExitService({ ticketRepository, paymentRepository, slotService, pricingService });
  const adminService = new AdminService({ parkingLotService, slotService });

  const authController = new AuthController(authService);
  const entryController = new EntryController(entryService);
  const exitController = new ExitController(exitService);
  const parkingLotController = new ParkingLotController(parkingLotService);
  const slotController = new SlotController(slotService);
  const adminController = new AdminController(adminService);

  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes(authController));
  app.use('/api/entry', entryRoutes(entryController));
  app.use('/api/exit', exitRoutes(exitController));
  app.use('/api/lots', parkingRoutes(parkingLotController));
  app.use('/api/slots', slotRoutes(slotController));
  app.use('/api/admin', adminRoutes(adminController));

  app.use(errorMiddleware);
  return app;
};
