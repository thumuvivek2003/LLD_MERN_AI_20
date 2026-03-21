import mongoose from "mongoose";

const schema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  name: String,
  order: Number,
});

export default mongoose.model("Column", schema);