// modules/friendship/friendship.model.js
// A directed edge userId → friendId. We seed both directions for symmetry.
import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Index on userId → fetch a user's friend list quickly (Step 13: Indexes).
friendshipSchema.index({ userId: 1 });
friendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export const FriendshipModel = mongoose.model('Friendship', friendshipSchema);
