import mongoose from "mongoose";

const URLSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  longUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  clickCount: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("URL", URLSchema);