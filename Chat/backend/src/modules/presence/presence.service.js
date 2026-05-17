import * as presenceRepo from './presence.repository.js';
import { publish } from '../../events/event-bus.js';
import { EVENTS } from '../../events/event.constants.js';

export async function markOnline(userId) {
  const user = await presenceRepo.updatePresence(userId, { isOnline: true });
  publish(EVENTS.USER_ONLINE, { userId: String(userId) });
  return user;
}

export async function markOffline(userId) {
  const user = await presenceRepo.updatePresence(userId, { isOnline: false });
  publish(EVENTS.USER_OFFLINE, {
    userId: String(userId),
    lastSeen: user?.lastSeen || new Date(),
  });
  return user;
}

export function getOnlineUsers() {
  return presenceRepo.getOnlineUsers();
}
