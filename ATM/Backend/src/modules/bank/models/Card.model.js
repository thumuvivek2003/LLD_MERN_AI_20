import mongoose from "mongoose";
import { cardSchema } from "../schemas/card.schema.js";

export const CardModel = mongoose.model("Card", cardSchema);
