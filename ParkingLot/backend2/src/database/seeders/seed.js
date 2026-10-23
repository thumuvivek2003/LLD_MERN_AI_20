import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { connectDB } from '../../config/db.config.js';
import { UserModel } from '../models/User.model.js';
import { ParkingLotModel } from '../models/ParkingLot.model.js';
import { ParkingSlotModel } from '../models/ParkingSlot.model.js';
import { TicketModel } from '../models/Ticket.model.js';
import { PaymentModel } from '../models/Payment.model.js';
import { UserRole } from '../../enums/UserRole.js';
import { VehicleType } from '../../enums/VehicleType.js';
import { SlotStatus } from '../../enums/SlotStatus.js';
import { TicketStatus } from '../../enums/TicketStatus.js';
import { PaymentStatus } from '../../enums/PaymentStatus.js';
import { TicketIdGenerator } from '../../utils/TicketIdGenerator.js';
import { Logger } from '../../utils/Logger.js';

const PASSWORD = 'password123';

const seedUsers = async () => {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const users = await UserModel.insertMany([
    { name: 'Admin', email: 'admin@test.com', passwordHash, role: UserRole.ADMIN },
    { name: 'Attendant', email: 'attendant@test.com', passwordHash, role: UserRole.ATTENDANT },
    { name: 'Customer', email: 'customer@test.com', passwordHash, role: UserRole.CUSTOMER },
  ]);
  Logger.info(`Seeded ${users.length} users`);
  return users;
};

const seedLots = async () => {
  const lots = await ParkingLotModel.insertMany([
    { name: 'Downtown Lot', address: '12 MG Road, Bengaluru' },
    { name: 'Airport Lot', address: 'KIA, Devanahalli' },
  ]);
  Logger.info(`Seeded ${lots.length} parking lots`);
  return lots;
};

const buildSlotsForLot = (lotId, floors = 2, perFloor = 6) => {
  const slots = [];
  const types = [VehicleType.BIKE, VehicleType.CAR, VehicleType.TRUCK];
  for (let f = 1; f <= floors; f++) {
    for (let n = 1; n <= perFloor; n++) {
      slots.push({
        lotId,
        floorNumber: f,
        slotNumber: n,
        vehicleType: types[(n - 1) % types.length],
        status: SlotStatus.AVAILABLE,
      });
    }
  }
  return slots;
};

const seedSlots = async (lots) => {
  const slotDocs = lots.flatMap((lot) => buildSlotsForLot(lot._id));
  const slots = await ParkingSlotModel.insertMany(slotDocs);

  const maintenanceSlot = slots[0];
  await ParkingSlotModel.findByIdAndUpdate(maintenanceSlot._id, { status: SlotStatus.MAINTENANCE });

  Logger.info(`Seeded ${slots.length} slots (1 set to MAINTENANCE for testing)`);
  return slots;
};

const seedActiveTicket = async (lot, slots) => {
  const slot = slots.find(
    (s) => s.lotId.equals(lot._id) && s.status === SlotStatus.AVAILABLE && s.vehicleType === VehicleType.CAR
  );
  if (!slot) return null;

  await ParkingSlotModel.findByIdAndUpdate(slot._id, { status: SlotStatus.OCCUPIED });

  const entryTime = new Date(Date.now() - 1000 * 60 * 90);
  const ticket = await TicketModel.create({
    ticketNumber: TicketIdGenerator.generate(),
    lotId: lot._id,
    slotId: slot._id,
    vehicle: { licensePlate: 'KA-01-AB-1234', type: VehicleType.CAR },
    entryTime,
    status: TicketStatus.ACTIVE,
  });

  Logger.info(`Active ticket: ${ticket.ticketNumber} (use this to test exit)`);
  return ticket;
};

const seedClosedTicket = async (lot, slots) => {
  const slot = slots.find(
    (s) => s.lotId.equals(lot._id) && s.status === SlotStatus.AVAILABLE && s.vehicleType === VehicleType.BIKE
  );
  if (!slot) return null;

  const entryTime = new Date(Date.now() - 1000 * 60 * 60 * 5);
  const exitTime = new Date(Date.now() - 1000 * 60 * 60 * 2);
  const amount = 60;

  const ticket = await TicketModel.create({
    ticketNumber: TicketIdGenerator.generate(),
    lotId: lot._id,
    slotId: slot._id,
    vehicle: { licensePlate: 'KA-02-XY-9876', type: VehicleType.BIKE },
    entryTime,
    exitTime,
    amount,
    status: TicketStatus.CLOSED,
  });

  await PaymentModel.create({
    ticketId: ticket._id,
    amount,
    method: 'CASH',
    status: PaymentStatus.PAID,
    paidAt: exitTime,
  });

  Logger.info(`Closed ticket with payment: ${ticket.ticketNumber}`);
  return ticket;
};

const wipe = async () => {
  await Promise.all([
    UserModel.deleteMany({}),
    ParkingLotModel.deleteMany({}),
    ParkingSlotModel.deleteMany({}),
    TicketModel.deleteMany({}),
    PaymentModel.deleteMany({}),
  ]);
  Logger.info('Cleared existing data');
};

const run = async () => {
  await connectDB();
  Logger.info('Connected to MongoDB');

  await wipe();
  await seedUsers();
  const lots = await seedLots();
  const slots = await seedSlots(lots);
  await seedActiveTicket(lots[0], slots);
  await seedClosedTicket(lots[0], slots);

  Logger.info('--- Seed complete ---');
  Logger.info(`Login: admin@test.com / ${PASSWORD}`);
  Logger.info(`Login: attendant@test.com / ${PASSWORD}`);
  Logger.info(`Login: customer@test.com / ${PASSWORD}`);
};

run()
  .catch((err) => {
    Logger.error('Seed failed', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
