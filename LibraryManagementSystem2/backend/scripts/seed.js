import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel.js';
import BookModel from '../models/BookModel.js';
import BorrowRequestModel from '../models/BorrowRequestModel.js';
import FineModel from '../models/FineModel.js';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const users = [
  {
    name: 'Admin User',
    email: 'admin@library.com',
    password: 'admin123',
    role: 'ADMIN',
    status: 'ACTIVE',
    isPremium: false,
  },
  {
    name: 'Alice Johnson',
    email: 'alice@library.com',
    password: 'user123',
    role: 'MEMBER',
    status: 'ACTIVE',
    isPremium: true,
  },
  {
    name: 'Bob Smith',
    email: 'bob@library.com',
    password: 'user123',
    role: 'MEMBER',
    status: 'ACTIVE',
    isPremium: false,
  },
  {
    name: 'Carol White',
    email: 'carol@library.com',
    password: 'user123',
    role: 'MEMBER',
    status: 'ACTIVE',
    isPremium: false,
  },
  {
    name: 'David Brown',
    email: 'david@library.com',
    password: 'user123',
    role: 'MEMBER',
    status: 'INACTIVE',
    isPremium: false,
  },
];

const books = [
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', totalCopies: 4, availableCopies: 4 },
  { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', isbn: '978-0201616224', totalCopies: 3, availableCopies: 3 },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', totalCopies: 2, availableCopies: 2 },
  { title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '978-1491904244', totalCopies: 5, availableCopies: 5 },
  { title: 'Introduction to Algorithms', author: 'Cormen et al.', isbn: '978-0262033848', totalCopies: 3, availableCopies: 3 },
  { title: 'The Mythical Man-Month', author: 'Frederick P. Brooks', isbn: '978-0201835953', totalCopies: 2, availableCopies: 2 },
  { title: 'Refactoring', author: 'Martin Fowler', isbn: '978-0134757599', totalCopies: 3, availableCopies: 3 },
  { title: 'Domain-Driven Design', author: 'Eric Evans', isbn: '978-0321125217', totalCopies: 2, availableCopies: 2 },
  { title: 'Structure and Interpretation of Computer Programs', author: 'Abelson & Sussman', isbn: '978-0262510875', totalCopies: 2, availableCopies: 2 },
  { title: 'The Art of Computer Programming', author: 'Donald Knuth', isbn: '978-0201485417', totalCopies: 1, availableCopies: 1 },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0596517748', totalCopies: 4, availableCopies: 4 },
  { title: 'Node.js Design Patterns', author: 'Mario Casciaro', isbn: '978-1839214110', totalCopies: 3, availableCopies: 3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    UserModel.deleteMany({}),
    BookModel.deleteMany({}),
    BorrowRequestModel.deleteMany({}),
    FineModel.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Seed users
  const hashedUsers = await Promise.all(
    users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) }))
  );
  const createdUsers = await UserModel.insertMany(hashedUsers);
  const [admin, alice, bob, carol] = createdUsers;
  console.log(`Created ${createdUsers.length} users`);

  // Seed books
  const createdBooks = await BookModel.insertMany(books);
  const [cleanCode, pragmatic, designPatterns, jsBook, algorithms, , refactoring] = createdBooks;
  console.log(`Created ${createdBooks.length} books`);

  // ── Borrow Requests simulation ──────────────────────────────────────────────

  // 1. Alice has an APPROVED borrow (due in 5 days)
  await BorrowRequestModel.create({
    user: alice._id,
    book: cleanCode._id,
    status: 'APPROVED',
    borrowDate: daysAgo(9),
    dueDate: daysFromNow(5),
  });
  await BookModel.findByIdAndUpdate(cleanCode._id, { $inc: { availableCopies: -1 } });

  // 2. Bob has an OVERDUE borrow (was due 3 days ago)
  const overdueRequest = await BorrowRequestModel.create({
    user: bob._id,
    book: pragmatic._id,
    status: 'OVERDUE',
    borrowDate: daysAgo(20),
    dueDate: daysAgo(3),
  });
  await BookModel.findByIdAndUpdate(pragmatic._id, { $inc: { availableCopies: -1 } });

  // 3. Fine for Bob's overdue book ($5/day × 3 days = $15)
  await FineModel.create({
    user: bob._id,
    borrowRequest: overdueRequest._id,
    amount: 15,
    status: 'PENDING',
  });

  // 4. Carol has a RETURNED borrow (returned yesterday, no fine)
  await BorrowRequestModel.create({
    user: carol._id,
    book: designPatterns._id,
    status: 'RETURNED',
    borrowDate: daysAgo(10),
    dueDate: daysAgo(1),
    returnDate: daysAgo(2),
  });

  // 5. Alice has a PENDING borrow request waiting for admin approval
  await BorrowRequestModel.create({
    user: alice._id,
    book: jsBook._id,
    status: 'PENDING',
  });

  // 6. Bob has a REJECTED request
  await BorrowRequestModel.create({
    user: bob._id,
    book: algorithms._id,
    status: 'REJECTED',
  });

  // 7. Carol has an APPROVED borrow with a paid fine from before
  const oldRequest = await BorrowRequestModel.create({
    user: carol._id,
    book: refactoring._id,
    status: 'RETURNED',
    borrowDate: daysAgo(30),
    dueDate: daysAgo(16),
    returnDate: daysAgo(14),
  });
  await FineModel.create({
    user: carol._id,
    borrowRequest: oldRequest._id,
    amount: 10,
    status: 'PAID',
    paidAt: daysAgo(14),
  });

  console.log('Created borrow requests and fines');

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log('\n─────────────────────────────────────────');
  console.log('  SEED COMPLETE');
  console.log('─────────────────────────────────────────');
  console.log('\n  ACCOUNTS');
  console.log('  Admin  → admin@library.com  / admin123');
  console.log('  Alice  → alice@library.com  / user123  (premium, active)');
  console.log('  Bob    → bob@library.com    / user123  (active, has overdue + fine)');
  console.log('  Carol  → carol@library.com  / user123  (active)');
  console.log('  David  → david@library.com  / user123  (inactive)');
  console.log('\n  BOOKS       : 12 titles seeded');
  console.log('\n  BORROW STATE');
  console.log('  APPROVED  → Alice  borrowing "Clean Code" (due in 5 days)');
  console.log('  OVERDUE   → Bob    overdue "The Pragmatic Programmer" (+3 days)');
  console.log('  PENDING   → Alice  waiting approval for "You Don\'t Know JS"');
  console.log('  REJECTED  → Bob    rejected for "Introduction to Algorithms"');
  console.log('  RETURNED  → Carol  returned "Design Patterns" on time');
  console.log('  RETURNED  → Carol  returned "Refactoring" 2 days late');
  console.log('\n  FINES');
  console.log('  PENDING   → Bob    $15.00 (3 days overdue)');
  console.log('  PAID      → Carol  $10.00 (paid on return)');
  console.log('─────────────────────────────────────────\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
