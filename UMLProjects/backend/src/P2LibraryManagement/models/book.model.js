import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['available', 'issued', 'reserved'],
    default: 'available'
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Book', BookSchema);