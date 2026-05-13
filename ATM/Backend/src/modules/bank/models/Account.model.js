import mongoose from "mongoose";
import { accountSchema } from "../schemas/account.schema.js";

export const AccountModel = mongoose.model("Account", accountSchema);
