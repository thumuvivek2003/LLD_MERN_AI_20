import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: String,
  description: String,
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List"
  },
  position: Number,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Card", cardSchema);