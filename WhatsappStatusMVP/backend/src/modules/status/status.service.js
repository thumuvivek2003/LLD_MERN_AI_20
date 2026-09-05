// modules/status/status.service.js — orchestrator (design notes Step 14/15).
// Coordinates FriendService, StatusRepository, PrivacyService, ViewService,
// FeedService and ResumeService. Contains no DB queries and no ordering math
// itself — it delegates, matching the single-responsibility split.
import { statusRepository } from './status.repository.js';
import { validateCreateStatus } from './status.validator.js';
import { toFeedResponse, toStatusResponse, toOwnStatusResponse } from './status.mapper.js';
import { friendshipService } from '../friendship/friendship.service.js';
import { privacyService } from '../privacy/privacy.service.js';
import { viewService } from '../view/view.service.js';
import { viewRepository } from '../view/view.repository.js';
import { userRepository } from '../user/user.repository.js';
import { toUserResponse } from '../user/user.mapper.js';
import { feedService } from '../../core/feed/feed.service.js';
import { resumeService } from '../../core/feed/resume.service.js';
import { socketPublisher } from '../../core/socket/socket.publisher.js';
import { computeExpiry, isExpired } from '../../core/utils/date.util.js';
import { NotFoundError } from '../../core/errors/notFound.error.js';
import { ForbiddenError } from '../../core/errors/validation.error.js';

class StatusService {
  // ── Create ────────────────────────────────────────────────────────────
  async createStatus(ownerId, body) {
    const data = validateCreateStatus(body);
    const status = await statusRepository.create({
      ownerId,
      ...data,
      createdAt: new Date(),
      expiresAt: computeExpiry(),
    });

    // Notify friends live (Observer/Pub-Sub) — only the owner's neighbourhood.
    const friendIds = await friendshipService.getFriendIds(ownerId);
    socketPublisher.publishStatusCreated({ ownerId, audienceIds: friendIds });

    return toOwnStatusResponse(status.toObject(), { viewersCount: 0 });
  }

  // ── Home feed (grouped, privacy-filtered, ordered) ────────────────────
  async buildFeed(currentUserId) {
    // 1. friend ids (bounded neighbourhood — never all users)
    const friendIds = await friendshipService.getFriendIds(currentUserId);
    if (friendIds.length === 0) return [];

    // 2. one $in query for active statuses of those friends
    const statuses = await statusRepository.findActiveStatusesByOwners(friendIds);
    if (statuses.length === 0) return [];

    // 3. privacy filter (Strategy per status)
    const visible = privacyService.filterVisible(statuses, currentUserId);
    if (visible.length === 0) return [];

    // 4. seen map for this viewer
    const seenSet = await viewService.getSeenMap(currentUserId, visible.map((s) => String(s._id)));

    // 5. owner profiles for display
    const userMap = await this._userMap(visible.map((s) => s.ownerId));

    // 6. group + partition + sort (FeedService + State ordering)
    const groups = feedService.buildFeed(visible, seenSet, userMap);
    return groups.map(toFeedResponse);
  }

  // ── One friend's statuses (drill-down / story viewer) ─────────────────
  async getStatuses(currentUserId, ownerId) {
    const owner = await userRepository.findById(ownerId);
    if (!owner) throw new NotFoundError('User not found');

    const statuses = await statusRepository.findActiveByOwner(ownerId);
    const visible = privacyService.filterVisible(statuses, currentUserId);
    if (visible.length === 0) throw new NotFoundError('No active statuses');

    const seenSet = await viewService.getSeenMap(currentUserId, visible.map((s) => String(s._id)));
    const mapped = visible.map((s) => toStatusResponse(s, { seen: seenSet.has(String(s._id)) }));

    return {
      user: toUserResponse(owner),
      statuses: mapped,
      resumeIndex: resumeService.findResumeIndex(mapped),
    };
  }

  // ── My own statuses (My Status screen) ────────────────────────────────
  async getMyStatuses(currentUserId) {
    const statuses = await statusRepository.findActiveByOwner(currentUserId);
    const withCounts = await Promise.all(
      statuses.map(async (s) => {
        const viewersCount = await viewRepository.countViewers(s._id);
        return toOwnStatusResponse(s, { viewersCount });
      })
    );
    // Newest first for the "My status" list.
    withCounts.reverse();
    return { statuses: withCounts };
  }

  // ── Delete own status ─────────────────────────────────────────────────
  async removeStatus(currentUserId, statusId) {
    const status = await statusRepository.findById(statusId);
    if (!status) throw new NotFoundError('Status not found');
    if (String(status.ownerId) !== String(currentUserId)) {
      throw new ForbiddenError('You can only delete your own status');
    }
    await statusRepository.deleteById(statusId);

    const friendIds = await friendshipService.getFriendIds(currentUserId);
    socketPublisher.publishStatusDeleted({ ownerId: currentUserId, statusId, audienceIds: friendIds });
    return { ok: true };
  }

  // ── Viewers of a status (owner only) ──────────────────────────────────
  async getStatusViewers(currentUserId, statusId) {
    const status = await statusRepository.findById(statusId);
    if (!status || isExpired(status.expiresAt)) throw new NotFoundError('Status not found or expired');
    if (String(status.ownerId) !== String(currentUserId)) {
      throw new ForbiddenError('Only the owner can see viewers');
    }

    const rows = await viewRepository.findViewersOfStatus(statusId);
    const userMap = await this._userMap(rows.map((r) => r.viewerId));
    const viewers = rows.map((r) => {
      const u = userMap.get(String(r.viewerId));
      return { id: String(r.viewerId), name: u?.name || 'Unknown', avatar: u?.avatar || '', viewedAt: r.viewedAt };
    });
    return { count: viewers.length, viewers };
  }

  // helper: build a Map(id → user response) for a set of user ids
  async _userMap(ids) {
    const unique = [...new Set(ids.map(String))];
    const users = await userRepository.findByIds(unique);
    return new Map(users.map((u) => [String(u._id), toUserResponse(u)]));
  }
}

export const statusService = new StatusService();
