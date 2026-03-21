import mongoose from "mongoose";

const schema = new mongoose.Schema({
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  permissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
});

export default mongoose.model("RolePermission", schema);