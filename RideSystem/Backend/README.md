# Ride System Backend

MVP Uber-like ride booking API. Node + Express + MongoDB + Socket.IO. ESM modules. SOLID & module-based.

## Patterns used
- **State Pattern** – Ride lifecycle (`modules/ride/state/*`)
- **Strategy Pattern** – Driver matching (`modules/ride/strategies/*`), Payment methods (`modules/payment/strategies/*`)
- **Factory Pattern** – `RideStateFactory`, `DriverStrategyFactory`, `PaymentStrategyFactory`, `VehicleFactory`
- **Repository Pattern** – `core/base/base.repository.js` + per-module repos
- **Observer / Pub-Sub** – `core/event-bus` with publishers & subscribers
- **Singleton** – `socketManager`, `eventBus`, mongo connection

## Run

```bash
cd Backend
npm install
npm run seed   # seed users, drivers, vehicles, rides (password: password123)
npm run dev
```

Defaults: `http://localhost:4000` (configurable via `.env`).

## Seed data

`npm run seed` wipes the DB and loads:
- 1 admin (`admin@ride.com`)
- 5 riders (one blocked for testing) — `rohit@`, `priya@`, `ankit@`, `neha@`, `blocked.rider@ride.com`
- 6 drivers with vehicles across all states (4 ONLINE, 1 OFFLINE, 1 BUSY)
- 6 completed rides with paid payments (UPI / Card / Cash) for history
- 1 cancelled ride
- 3 active rides: one REQUESTED (for drivers to accept), one DRIVER_ASSIGNED with OTP (for arrive + verify-otp), one IN_PROGRESS

Password for every account: `password123`.

## Core flow
1. Rider signs up + logs in
2. Driver signs up + registers vehicle + goes online (`PUT /drivers/status`)
3. Rider creates a ride (`POST /rides`)
4. Online drivers receive `ride:incoming` via Socket.IO
5. First driver to `POST /rides/:id/accept` wins (atomic update)
6. Driver marks arrived (`POST /rides/:id/arrive`)
7. Driver enters OTP shown to rider (`POST /rides/:id/verify-otp`) → trip starts
8. Driver completes (`POST /rides/:id/complete`)
9. Rider pays (`POST /payments/:rideId`)
