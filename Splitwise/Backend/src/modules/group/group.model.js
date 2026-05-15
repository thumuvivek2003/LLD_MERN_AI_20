import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["CREATOR", "MEMBER"], default: "MEMBER" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    createdBy: { type: String, required: true, index: true },
    members: { type: [memberSchema], default: [] },
  },
  { timestamps: true }
);

export const GroupModel = mongoose.model("Group", groupSchema);

export function toGroupDTO(doc) {
  if (!doc) return null;
  return {
    groupId: doc.groupId,
    name: doc.name,
    description: doc.description || "",
    createdBy: doc.createdBy,
    members: (doc.members || []).map((m) => ({
      userId: m.userId,
      name: m.name,
      role: m.role,
      status: m.status,
      joinedAt: m.joinedAt,
    })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
