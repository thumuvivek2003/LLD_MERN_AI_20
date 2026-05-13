import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { connectDatabase } from '../config/db.config.js';
import { logger } from '../core/utils/logger.util.js';

import { User } from '../modules/user/user.model.js';
import { Driver } from '../modules/driver/driver.model.js';
import { Vehicle } from '../modules/vehicle/vehicle.model.js';
import { Ride } from '../modules/ride/ride.model.js';
import { Payment } from '../modules/payment/payment.model.js';

import { otpService } from '../modules/otp/otp.service.js';
import { haversineKm } from '../core/utils/distance.util.js';
import { calculateFare } from '../core/utils/fare.util.js';
import {
  ROLES,
  DRIVER_STATUS,
  VEHICLE_TYPE,
  RIDE_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
} from '../config/constants.js';

const PASSWORD = 'password123';

const PLACES = {
  CONNAUGHT_PLACE: { address: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167 },
  INDIA_GATE: { address: 'India Gate, Delhi', lat: 28.6129, lng: 77.2295 },
  CYBER_CITY: { address: 'Cyber City, Gurugram', lat: 28.4951, lng: 77.0884 },
  IGI_AIRPORT: { address: 'IGI Airport T3, Delhi', lat: 28.5562, lng: 77.0999 },
  SAKET: { address: 'Saket, Delhi', lat: 28.5245, lng: 77.2066 },
  NOIDA_SECTOR_18: { address: 'Sector 18, Noida', lat: 28.5707, lng: 77.3260 },
  KAROL_BAGH: { address: 'Karol Bagh, Delhi', lat: 28.6519, lng: 77.1909 },
  HAUZ_KHAS: { address: 'Hauz Khas, Delhi', lat: 28.5494, lng: 77.2001 },
};

async function clearAll() {
  await Promise.all([
    User.deleteMany({}),
    Driver.deleteMany({}),
    Vehicle.deleteMany({}),
    Ride.deleteMany({}),
    Payment.deleteMany({}),
  ]);
  logger.info('Cleared existing data');
}

async function createUsers(hash) {
  const data = [
    // Admin
    { name: 'Super Admin', email: 'admin@ride.com', password: hash, phone: '9000000000', role: ROLES.ADMIN, rating: 5 },

    // Riders
    { name: 'Rohit Kumar', email: 'rohit@ride.com', password: hash, phone: '9000000001', role: ROLES.RIDER, rating: 4.8 },
    { name: 'Priya Sharma', email: 'priya@ride.com', password: hash, phone: '9000000002', role: ROLES.RIDER, rating: 4.9 },
    { name: 'Ankit Verma', email: 'ankit@ride.com', password: hash, phone: '9000000003', role: ROLES.RIDER, rating: 4.7 },
    { name: 'Neha Gupta', email: 'neha@ride.com', password: hash, phone: '9000000004', role: ROLES.RIDER, rating: 5.0 },
    { name: 'Blocked Rider', email: 'blocked.rider@ride.com', password: hash, phone: '9000000005', role: ROLES.RIDER, isBlocked: true, rating: 3.5 },

    // Drivers (created via auth flow normally — we'll create Driver profile after)
    { name: 'Aman Sharma', email: 'aman@ride.com', password: hash, phone: '9000000101', role: ROLES.DRIVER, rating: 4.9 },
    { name: 'Vikas Yadav', email: 'vikas@ride.com', password: hash, phone: '9000000102', role: ROLES.DRIVER, rating: 4.7 },
    { name: 'Sunita Devi', email: 'sunita@ride.com', password: hash, phone: '9000000103', role: ROLES.DRIVER, rating: 4.8 },
    { name: 'Imran Khan', email: 'imran@ride.com', password: hash, phone: '9000000104', role: ROLES.DRIVER, rating: 4.6 },
    { name: 'Offline Driver', email: 'offline@ride.com', password: hash, phone: '9000000105', role: ROLES.DRIVER, rating: 4.5 },
    { name: 'Busy Driver', email: 'busy@ride.com', password: hash, phone: '9000000106', role: ROLES.DRIVER, rating: 4.4 },
  ];
  const created = await User.create(data);
  const byEmail = Object.fromEntries(created.map((u) => [u.email, u]));
  logger.info(`Created ${created.length} users`);
  return byEmail;
}

async function createDriversAndVehicles(byEmail) {
  const driverConfigs = [
    { email: 'aman@ride.com',    type: VEHICLE_TYPE.SEDAN, model: 'Honda City',  plate: 'DL 1A 1001', color: 'White', status: DRIVER_STATUS.ONLINE,  location: PLACES.CONNAUGHT_PLACE, license: 'DL-AM-001', rating: 4.9, totalTrips: 412, totalEarnings: 124500 },
    { email: 'vikas@ride.com',   type: VEHICLE_TYPE.MINI,  model: 'Maruti Swift', plate: 'DL 2B 2002', color: 'Red',   status: DRIVER_STATUS.ONLINE,  location: PLACES.SAKET,          license: 'DL-VK-002', rating: 4.7, totalTrips: 287, totalEarnings: 78600 },
    { email: 'sunita@ride.com',  type: VEHICLE_TYPE.SUV,   model: 'Toyota Innova', plate: 'DL 3C 3003', color: 'Silver', status: DRIVER_STATUS.ONLINE, location: PLACES.HAUZ_KHAS,      license: 'DL-SD-003', rating: 4.8, totalTrips: 521, totalEarnings: 198400 },
    { email: 'imran@ride.com',   type: VEHICLE_TYPE.BIKE,  model: 'Bajaj Pulsar', plate: 'DL 4D 4004', color: 'Black', status: DRIVER_STATUS.ONLINE,  location: PLACES.KAROL_BAGH,     license: 'DL-IK-004', rating: 4.6, totalTrips: 198, totalEarnings: 42300 },
    { email: 'offline@ride.com', type: VEHICLE_TYPE.SEDAN, model: 'Hyundai Verna', plate: 'DL 5E 5005', color: 'Grey',  status: DRIVER_STATUS.OFFLINE, location: PLACES.NOIDA_SECTOR_18, license: 'DL-OD-005', rating: 4.5, totalTrips: 99,  totalEarnings: 28500 },
    { email: 'busy@ride.com',    type: VEHICLE_TYPE.SEDAN, model: 'Honda Amaze',  plate: 'DL 6F 6006', color: 'Blue',  status: DRIVER_STATUS.BUSY,    location: PLACES.CYBER_CITY,     license: 'DL-BD-006', rating: 4.4, totalTrips: 132, totalEarnings: 36400 },
  ];

  const driversByEmail = {};
  for (const cfg of driverConfigs) {
    const user = byEmail[cfg.email];
    const vehicle = await Vehicle.create({
      owner: user._id,
      type: cfg.type,
      model: cfg.model,
      numberPlate: cfg.plate,
      color: cfg.color,
    });
    const driver = await Driver.create({
      user: user._id,
      license: cfg.license,
      status: cfg.status,
      currentLocation: { lat: cfg.location.lat, lng: cfg.location.lng },
      rating: cfg.rating,
      totalTrips: cfg.totalTrips,
      totalEarnings: cfg.totalEarnings,
      activeVehicle: vehicle._id,
    });
    driversByEmail[cfg.email] = { user, driver, vehicle };
  }
  logger.info(`Created ${driverConfigs.length} drivers with vehicles`);
  return driversByEmail;
}

function fareFor(pickup, drop) {
  const km = Number(haversineKm(pickup, drop).toFixed(2));
  return { km, fare: calculateFare(km) };
}

async function createCompletedRides(byEmail, driversByEmail) {
  const completedSpecs = [
    { rider: 'rohit@ride.com', driver: 'aman@ride.com',  pickup: PLACES.CONNAUGHT_PLACE, drop: PLACES.IGI_AIRPORT,    method: PAYMENT_METHOD.UPI,  daysAgo: 1 },
    { rider: 'rohit@ride.com', driver: 'vikas@ride.com', pickup: PLACES.INDIA_GATE,      drop: PLACES.CYBER_CITY,     method: PAYMENT_METHOD.CARD, daysAgo: 3 },
    { rider: 'priya@ride.com', driver: 'aman@ride.com',  pickup: PLACES.SAKET,           drop: PLACES.HAUZ_KHAS,      method: PAYMENT_METHOD.CASH, daysAgo: 4 },
    { rider: 'priya@ride.com', driver: 'sunita@ride.com',pickup: PLACES.KAROL_BAGH,      drop: PLACES.NOIDA_SECTOR_18, method: PAYMENT_METHOD.UPI,  daysAgo: 6 },
    { rider: 'ankit@ride.com', driver: 'imran@ride.com', pickup: PLACES.HAUZ_KHAS,       drop: PLACES.INDIA_GATE,     method: PAYMENT_METHOD.CASH, daysAgo: 7 },
    { rider: 'neha@ride.com',  driver: 'aman@ride.com',  pickup: PLACES.NOIDA_SECTOR_18, drop: PLACES.CONNAUGHT_PLACE, method: PAYMENT_METHOD.CARD, daysAgo: 9 },
  ];

  for (const s of completedSpecs) {
    const rider = byEmail[s.rider];
    const { user: driverUser, vehicle } = driversByEmail[s.driver];
    const { km, fare } = fareFor(s.pickup, s.drop);
    const createdAt = new Date(Date.now() - s.daysAgo * 24 * 60 * 60 * 1000);
    const ride = await Ride.create({
      rider: rider._id,
      driver: driverUser._id,
      vehicle: vehicle._id,
      pickup: s.pickup,
      drop: s.drop,
      distanceKm: km,
      fare,
      status: RIDE_STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.PAID,
      requestedAt: createdAt,
      assignedAt: new Date(createdAt.getTime() + 30 * 1000),
      arrivedAt: new Date(createdAt.getTime() + 5 * 60 * 1000),
      startedAt: new Date(createdAt.getTime() + 6 * 60 * 1000),
      completedAt: new Date(createdAt.getTime() + 30 * 60 * 1000),
      createdAt,
    });
    await Payment.create({
      ride: ride._id,
      rider: rider._id,
      driver: driverUser._id,
      amount: fare,
      method: s.method,
      status: PAYMENT_STATUS.PAID,
      transactionRef: `${s.method}-${ride._id}`,
      paidAt: new Date(createdAt.getTime() + 32 * 60 * 1000),
    });
  }
  logger.info(`Created ${completedSpecs.length} completed rides with payments`);
}

async function createCancelledRides(byEmail, driversByEmail) {
  const rider = byEmail['ankit@ride.com'];
  const driverUser = driversByEmail['vikas@ride.com'].user;
  const { km, fare } = fareFor(PLACES.CONNAUGHT_PLACE, PLACES.SAKET);
  const t = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  await Ride.create({
    rider: rider._id, driver: driverUser._id,
    vehicle: driversByEmail['vikas@ride.com'].vehicle._id,
    pickup: PLACES.CONNAUGHT_PLACE, drop: PLACES.SAKET,
    distanceKm: km, fare,
    status: RIDE_STATUS.CANCELLED,
    requestedAt: t,
    assignedAt: new Date(t.getTime() + 30 * 1000),
    cancelledAt: new Date(t.getTime() + 2 * 60 * 1000),
    cancelledBy: ROLES.RIDER,
    createdAt: t,
  });
  logger.info('Created 1 cancelled ride');
}

async function createActiveRides(byEmail, driversByEmail) {
  // 1) REQUESTED — open ride waiting for a driver to accept
  {
    const rider = byEmail['neha@ride.com'];
    const { km, fare } = fareFor(PLACES.KAROL_BAGH, PLACES.IGI_AIRPORT);
    await Ride.create({
      rider: rider._id,
      pickup: PLACES.KAROL_BAGH, drop: PLACES.IGI_AIRPORT,
      distanceKm: km, fare,
      status: RIDE_STATUS.REQUESTED,
      requestedAt: new Date(),
    });
  }

  // 2) DRIVER_ASSIGNED — driver accepted, headed to pickup, OTP ready
  {
    const rider = byEmail['priya@ride.com'];
    const { user: driverUser, vehicle } = driversByEmail['sunita@ride.com'];
    const { km, fare } = fareFor(PLACES.SAKET, PLACES.NOIDA_SECTOR_18);
    const ride = await Ride.create({
      rider: rider._id,
      driver: driverUser._id,
      vehicle: vehicle._id,
      pickup: PLACES.SAKET, drop: PLACES.NOIDA_SECTOR_18,
      distanceKm: km, fare,
      status: RIDE_STATUS.DRIVER_ASSIGNED,
      requestedAt: new Date(Date.now() - 2 * 60 * 1000),
      assignedAt: new Date(),
    });
    const otp = otpService.generateForRide(ride._id);
    ride.otp = otp;
    await ride.save();
  }

  // 3) IN_PROGRESS — busy driver is mid-trip
  {
    const rider = byEmail['rohit@ride.com'];
    const { user: driverUser, vehicle } = driversByEmail['busy@ride.com'];
    const { km, fare } = fareFor(PLACES.CYBER_CITY, PLACES.CONNAUGHT_PLACE);
    const start = new Date(Date.now() - 8 * 60 * 1000);
    const ride = await Ride.create({
      rider: rider._id,
      driver: driverUser._id,
      vehicle: vehicle._id,
      pickup: PLACES.CYBER_CITY, drop: PLACES.CONNAUGHT_PLACE,
      distanceKm: km, fare,
      status: RIDE_STATUS.IN_PROGRESS,
      requestedAt: new Date(start.getTime() - 5 * 60 * 1000),
      assignedAt: new Date(start.getTime() - 4 * 60 * 1000),
      arrivedAt: new Date(start.getTime() - 1 * 60 * 1000),
      startedAt: start,
    });
    const otp = otpService.generateForRide(ride._id);
    ride.otp = otp;
    await ride.save();
  }

  logger.info('Created 3 active rides (REQUESTED, DRIVER_ASSIGNED, IN_PROGRESS)');
}

function printCredentials() {
  /* eslint-disable no-console */
  console.log('\n────────────────────────────────────────────────────────────');
  console.log('  RIDE SYSTEM — Seed credentials  (password for all: password123)');
  console.log('────────────────────────────────────────────────────────────');
  console.log('  Admin  : admin@ride.com');
  console.log('');
  console.log('  Riders : rohit@ride.com, priya@ride.com, ankit@ride.com,');
  console.log('           neha@ride.com  (neha has an open ride request)');
  console.log('           blocked.rider@ride.com (blocked — login should fail)');
  console.log('');
  console.log('  Drivers: aman@ride.com    (ONLINE  · Connaught Place)');
  console.log('           vikas@ride.com   (ONLINE  · Saket)');
  console.log('           sunita@ride.com  (ONLINE  · Hauz Khas · has assigned ride)');
  console.log('           imran@ride.com   (ONLINE  · Karol Bagh)');
  console.log('           offline@ride.com (OFFLINE · Noida)');
  console.log('           busy@ride.com    (BUSY    · Cyber City · trip IN_PROGRESS)');
  console.log('────────────────────────────────────────────────────────────');
  console.log('  Active scenarios you can test:');
  console.log('   • neha@ride.com has a REQUESTED ride — login as any ONLINE driver');
  console.log('     and accept it (GET /rides/pending → POST /rides/:id/accept).');
  console.log('   • priya@ride.com has a DRIVER_ASSIGNED ride with sunita@ride.com');
  console.log('     — login as sunita to test arrive + OTP + complete flow.');
  console.log('   • rohit@ride.com is mid-trip with busy@ride.com.');
  console.log('────────────────────────────────────────────────────────────\n');
}

async function run() {
  await connectDatabase();
  await clearAll();

  const hash = await bcrypt.hash(PASSWORD, 10);
  const byEmail = await createUsers(hash);
  const driversByEmail = await createDriversAndVehicles(byEmail);

  await createCompletedRides(byEmail, driversByEmail);
  await createCancelledRides(byEmail, driversByEmail);
  await createActiveRides(byEmail, driversByEmail);

  printCredentials();
  await mongoose.disconnect();
  logger.info('Seed completed');
}

run().catch(async (err) => {
  logger.error('Seed failed', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
