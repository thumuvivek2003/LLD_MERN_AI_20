import mongoose from "mongoose";

const ClickSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    index: true
  },

  ipAddress: {
    type: String
  },

  userAgent: {
    type: String
  },

  country: {
    type: String
  },

  device: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Click", ClickSchema);