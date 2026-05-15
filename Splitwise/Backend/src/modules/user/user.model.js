import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);

export function toUserDTO(doc) {
  if (!doc) return null;
  return {
    userId: doc.userId,
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
  };
}
