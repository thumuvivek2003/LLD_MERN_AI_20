import mongoose from "mongoose";

const schema = new mongoose.Schema({
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: "Column" },
  title: String,
  description: String,
  position: Number,
});

export default mongoose.model("Card", schema);