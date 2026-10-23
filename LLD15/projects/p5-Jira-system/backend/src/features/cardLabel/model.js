import mongoose from "mongoose";

const schema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  labelId: { type: mongoose.Schema.Types.ObjectId, ref: "Label" },
});

export default mongoose.model("CardLabel", schema);