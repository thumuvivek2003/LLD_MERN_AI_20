require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');

const books = [
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', genre: 'Technology', totalCopies: 5, availableCopies: 5, publisher: 'Prentice Hall', publishedYear: 2008 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', genre: 'Technology', totalCopies: 3, availableCopies: 3, publisher: 'Addison-Wesley', publishedYear: 2019 },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', genre: 'Technology', totalCopies: 4, availableCopies: 4, publisher: 'Addison-Wesley', publishedYear: 1994 },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0596517748', genre: 'Technology', totalCopies: 6, availableCopies: 6, publisher: "O'Reilly", publishedYear: 2008 },
  { title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '978-1491904244', genre: 'Technology', totalCopies: 4, availableCopies: 4, publisher: "O'Reilly", publishedYear: 2015 },
  { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', genre: 'Self-Help', totalCopies: 8, availableCopies: 8, publisher: 'Avery', publishedYear: 2018 },
  { title: 'Deep Work', author: 'Cal Newport', isbn: '978-1455586691', genre: 'Self-Help', totalCopies: 5, availableCopies: 5, publisher: 'Grand Central', publishedYear: 2016 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', genre: 'Fiction', totalCopies: 10, availableCopies: 10, publisher: 'Scribner', publishedYear: 1925 },
  { title: '1984', author: 'George Orwell', isbn: '978-0451524935', genre: 'Fiction', totalCopies: 7, availableCopies: 7, publisher: 'Signet Classic', publishedYear: 1949 },
  { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', genre: 'History', totalCopies: 6, availableCopies: 6, publisher: 'Harper', publishedYear: 2015 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Book.deleteMany({});

  await User.create([
    { name: 'Admin User', email: 'admin@library.com', password: 'admin123', role: 'admin' },
    { name: 'John Doe', email: 'john@library.com', password: 'user123', role: 'user' },
    { name: 'Jane Smith', email: 'jane@library.com', password: 'user123', role: 'user' },
  ]);

  await Book.insertMany(books);

  console.log('Seed data inserted successfully.');
  console.log('Admin: admin@library.com / admin123');
  console.log('User:  john@library.com / user123');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
