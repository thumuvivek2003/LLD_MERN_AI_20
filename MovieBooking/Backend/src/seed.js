import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from './modules/auth/auth.model.js';
import { Movie } from './modules/movies/movie.model.js';
import { Theater } from './modules/theaters/theater.model.js';
import { Screen } from './modules/screens/screen.model.js';
import { Show } from './modules/shows/show.model.js';
import { Seat } from './modules/seats/seat.model.js';
import { Booking } from './modules/bookings/booking.model.js';
import { Payment } from './modules/payments/payment.model.js';
import { generateRef } from './shared/utils/generateId.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviebooking';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const USERS = [
  { name: 'Admin User',  email: 'admin@cinebook.com',  password: 'admin123',  role: 'admin' },
  { name: 'Alice Kumar', email: 'alice@cinebook.com',  password: 'user123',   role: 'user'  },
  { name: 'Bob Sharma',  email: 'bob@cinebook.com',    password: 'user123',   role: 'user'  },
];

const MOVIES = [
  {
    title: 'Avengers: Endgame',
    description: 'The Avengers assemble once more to reverse Thanos\'s actions and restore balance to the universe.',
    duration: 181,
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    language: 'English',
    releaseDate: new Date('2019-04-26'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    rating: 8.4,
    director: 'Anthony & Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    isActive: true,
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.',
    duration: 148,
    genre: ['Sci-Fi', 'Thriller', 'Action'],
    language: 'English',
    releaseDate: new Date('2010-07-16'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    rating: 8.8,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    isActive: true,
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    duration: 169,
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    language: 'English',
    releaseDate: new Date('2014-11-07'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    rating: 8.7,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    isActive: true,
  },
  {
    title: 'The Dark Knight',
    description: 'Batman faces the Joker, a criminal mastermind who plunges Gotham City into anarchy.',
    duration: 152,
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    releaseDate: new Date('2008-07-18'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    rating: 9.0,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    isActive: true,
  },
];

const THEATERS = [
  { name: 'PVR Cinemas',   city: 'Mumbai',    address: 'Phoenix Mall, Lower Parel' },
  { name: 'INOX Leisure',  city: 'Bangalore', address: 'Forum Mall, Koramangala'  },
  { name: 'Cinepolis',     city: 'Hyderabad', address: 'Inorbit Mall, Hitech City' },
];

// Generate seat layout: rows A-J, first 2 rows premium (8 seats), rest normal (10 seats)
const makeLayout = (rows = 8, normalSeats = 10, premiumSeats = 8, premiumRows = 2) => {
  const layout = [];
  for (let i = 0; i < rows; i++) {
    const row = String.fromCharCode(65 + i);
    const isPremium = i < premiumRows;
    layout.push({ row, type: isPremium ? 'premium' : 'normal', seats: isPremium ? premiumSeats : normalSeats });
  }
  return layout;
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB\n');

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Movie.deleteMany({}),
    Theater.deleteMany({}),
    Screen.deleteMany({}),
    Show.deleteMany({}),
    Seat.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // ── Users ──
  const users = await User.insertMany(USERS.map(u => ({ ...u })));
  // insertMany skips the pre-save hook, so hash manually
  for (const user of users) {
    user.password = USERS.find(u => u.email === user.email).password;
    await user.save(); // triggers bcrypt hook
  }

  // Re-fetch clean user docs
  const [admin, alice, bob] = await Promise.all(USERS.map(u => User.findOne({ email: u.email })));
  console.log(`Created ${users.length} users`);

  // ── Movies ──
  const movies = await Movie.insertMany(MOVIES);
  console.log(`Created ${movies.length} movies`);

  // ── Theaters + Screens ──
  const createdTheaters = [];
  const createdScreens = [];

  for (const theaterData of THEATERS) {
    const theater = await Theater.create({ ...theaterData, totalScreens: 2 });
    createdTheaters.push(theater);

    const layout1 = makeLayout(8, 10, 8, 2); // Screen 1: 2 premium rows + 6 normal
    const layout2 = makeLayout(6, 12, 10, 1); // Screen 2: 1 premium row + 5 normal

    const totalSeats1 = layout1.reduce((s, r) => s + r.seats, 0);
    const totalSeats2 = layout2.reduce((s, r) => s + r.seats, 0);

    const s1 = await Screen.create({ theaterId: theater._id, name: 'Screen 1', rows: 8, seatsPerRow: 10, totalSeats: totalSeats1, seatLayout: layout1 });
    const s2 = await Screen.create({ theaterId: theater._id, name: 'Screen 2', rows: 6, seatsPerRow: 12, totalSeats: totalSeats2, seatLayout: layout2 });

    createdScreens.push(s1, s2);
  }
  console.log(`Created ${createdTheaters.length} theaters, ${createdScreens.length} screens`);

  // ── Shows (today + tomorrow) ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const showConfigs = [
    // Theater 0 (Mumbai PVR)
    { movieIdx: 0, screenIdx: 0, date: today,    startTime: '10:00', basePrice: 200, premiumPrice: 350 },
    { movieIdx: 0, screenIdx: 0, date: today,    startTime: '14:00', basePrice: 200, premiumPrice: 350 },
    { movieIdx: 1, screenIdx: 1, date: today,    startTime: '11:30', basePrice: 180, premiumPrice: 300 },
    { movieIdx: 1, screenIdx: 1, date: tomorrow, startTime: '17:00', basePrice: 180, premiumPrice: 300 },
    // Theater 1 (Bangalore INOX)
    { movieIdx: 2, screenIdx: 2, date: today,    startTime: '09:00', basePrice: 220, premiumPrice: 380 },
    { movieIdx: 2, screenIdx: 2, date: tomorrow, startTime: '15:00', basePrice: 220, premiumPrice: 380 },
    { movieIdx: 3, screenIdx: 3, date: today,    startTime: '13:00', basePrice: 190, premiumPrice: 320 },
    // Theater 2 (Hyderabad Cinepolis)
    { movieIdx: 0, screenIdx: 4, date: today,    startTime: '12:00', basePrice: 150, premiumPrice: 250 },
    { movieIdx: 3, screenIdx: 5, date: today,    startTime: '18:30', basePrice: 160, premiumPrice: 280 },
    { movieIdx: 1, screenIdx: 5, date: tomorrow, startTime: '20:00', basePrice: 160, premiumPrice: 280 },
  ];

  const createdShows = [];
  for (const cfg of showConfigs) {
    const screen = createdScreens[cfg.screenIdx];
    const show = await Show.create({
      movieId:      movies[cfg.movieIdx]._id,
      screenId:     screen._id,
      theaterId:    screen.theaterId,
      date:         cfg.date,
      startTime:    cfg.startTime,
      basePrice:    cfg.basePrice,
      premiumPrice: cfg.premiumPrice,
      status:       'active',
    });
    createdShows.push(show);

    // Initialize seats for this show
    const showWithScreen = await Show.findById(show._id).populate('screenId');
    const seatDocs = [];
    for (const rowCfg of showWithScreen.screenId.seatLayout) {
      for (let i = 1; i <= rowCfg.seats; i++) {
        seatDocs.push({
          showId:     show._id,
          screenId:   screen._id,
          row:        rowCfg.row,
          seatNumber: i,
          type:       rowCfg.type,
          price:      rowCfg.type === 'premium' ? cfg.premiumPrice : cfg.basePrice,
          status:     'available',
        });
      }
    }
    await Seat.insertMany(seatDocs);
  }
  console.log(`Created ${createdShows.length} shows with seats`);

  // ── Sample Booking for Alice ──
  const sampleShow = createdShows[0];
  const sampleSeats = await Seat.find({ showId: sampleShow._id, row: 'C' }).limit(2);

  const payment = await Payment.create({
    userId:        alice._id,
    amount:        sampleSeats.reduce((s, seat) => s + seat.price, 0),
    method:        'upi',
    status:        'success',
    transactionId: generateRef('UPI'),
  });

  const booking = await Booking.create({
    userId:      alice._id,
    showId:      sampleShow._id,
    seats:       sampleSeats.map(s => ({ seatId: s._id, row: s.row, seatNumber: s.seatNumber, type: s.type, price: s.price })),
    totalAmount: payment.amount,
    status:      'confirmed',
    paymentId:   payment._id,
    bookingRef:  generateRef('BK'),
  });

  await Seat.updateMany({ _id: { $in: sampleSeats.map(s => s._id) } }, { status: 'booked' });
  console.log(`Created 1 sample booking for Alice (ref: ${booking.bookingRef})`);

  // ── Summary ──
  console.log('\n══════════════════════════════════════════');
  console.log('           SEED COMPLETE');
  console.log('══════════════════════════════════════════');
  console.log('\n📋 LOGIN CREDENTIALS\n');
  console.log('  Role   │ Email                  │ Password');
  console.log('  ───────┼────────────────────────┼──────────');
  console.log('  Admin  │ admin@cinebook.com      │ admin123');
  console.log('  User   │ alice@cinebook.com      │ user123');
  console.log('  User   │ bob@cinebook.com        │ user123');
  console.log('\n🎬 Movies:', movies.map(m => m.title).join(', '));
  console.log('🏛️  Theaters:', createdTheaters.map(t => `${t.name} (${t.city})`).join(', '));
  console.log(`🎭 Shows: ${createdShows.length} across all theaters`);
  console.log(`🎟️  Sample Booking: ${booking.bookingRef} (Alice – C${sampleSeats.map(s=>s.seatNumber).join(', C')})`);
  console.log('\n══════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
