import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    content: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Comment", schema);