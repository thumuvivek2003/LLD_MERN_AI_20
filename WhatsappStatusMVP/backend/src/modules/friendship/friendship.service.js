// modules/friendship/friendship.service.js — getFriendIds()
// Answers the single question the feed needs: "who are my friends?"
import { friendshipRepository } from './friendship.repository.js';
import { userRepository } from '../user/user.repository.js';
import { toUserResponseList } from '../user/user.mapper.js';

class FriendshipService {
  async getFriendIds(userId) {
    const edges = await friendshipRepository.findFriends(userId);
    return edges.map((e) => String(e.friendId));
  }

  async getFriends(userId) {
    const ids = await this.getFriendIds(userId);
    const users = await userRepository.findByIds(ids);
    return toUserResponseList(users);
  }
}

export const friendshipService = new FriendshipService();
