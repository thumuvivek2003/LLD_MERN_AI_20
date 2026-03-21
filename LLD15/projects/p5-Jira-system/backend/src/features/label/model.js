import mongoose from "mongoose";

const schema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  name: String,
  color: String,
});

export default mongoose.model("Label", schema);