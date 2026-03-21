import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
});

export default mongoose.model("BoardMember", schema);