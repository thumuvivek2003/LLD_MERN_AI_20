import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    roleId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'roles' },
);

export const RoleModel = mongoose.model('Role', roleSchema);
