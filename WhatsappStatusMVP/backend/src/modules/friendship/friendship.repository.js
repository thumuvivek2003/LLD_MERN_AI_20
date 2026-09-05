// modules/friendship/friendship.repository.js — findFriends()
import { BaseRepository } from '../../core/repositories/base.repository.js';
import { FriendshipModel } from './friendship.model.js';

class FriendshipRepository extends BaseRepository {
  constructor() {
    super(FriendshipModel);
  }

  findFriends(userId) {
    return this.model.find({ userId }).lean();
  }
}

export const friendshipRepository = new FriendshipRepository();
