import mongoose from 'mongoose';

/**
 * One document per role.
 *  objects: { customer: { read, create, update, delete } }
 *  fields:  { customer: { f1: "WRITE", f2: "HIDDEN" } }
 */
const permissionSchema = new mongoose.Schema(
  {
    roleId: { type: String, required: true, unique: true, index: true },
    objects: { type: mongoose.Schema.Types.Mixed, default: {} },
    fields: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: 'permissions', minimize: false },
);

export const PermissionModel = mongoose.model('Permission', permissionSchema);
