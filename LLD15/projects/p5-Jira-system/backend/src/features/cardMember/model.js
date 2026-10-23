import mongoose from "mongoose";

const schema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("CardMember", schema);