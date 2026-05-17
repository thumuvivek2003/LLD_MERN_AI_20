import { verifyAccessToken } from '../../shared/utils/jwt.util.js';
import { logger } from '../../shared/logger/logger.js';
import socketManager from './socket.manager.js';
import { SOCKET_EVENTS } from './socket.events.js';
import { setIO, emitToAll } from './socket.emitter.js';
import { markOnline, markOffline } from '../presence/presence.service.js';
import { createMessage } from '../message/message.service.js';
import { markMessageRead, markChatReadAll } from '../delivery/delivery.service.js';
import { SocketSessionModel } from '../../models/socket-session.model.js';
import { UserModel } from '../../models/user.model.js';

/**
 * Auth handshake middleware. Reads `auth.token` (or query) and attaches user.
 */
function authMiddleware(socket, next) {
  try {
    const token = socket.handshake?.auth?.token || socket.handshake?.query?.token;
    if (!token) return next(new Error('Missing auth token'));
    const payload = verifyAccessToken(token);
    socket.user = { id: payload.sub, role: payload.role, mobile: payload.mobile };
    return next();
  } catch (err) {
    return next(new Error('Invalid auth token'));
  }
}

/**
 * Wire up Socket.IO server: auth, presence, message routing.
 */
export function registerSocketGateway(io) {
  setIO(io);
  io.use(authMiddleware);

  io.on('connection', (socket) => onConnection(io, socket));
}

async function onConnection(io, socket) {
  const userId = socket.user?.id;
  if (!userId) return socket.disconnect(true);

  // Enrich the user with display name (best-effort, ignore failure).
  try {
    const userDoc = await UserModel.findById(userId).lean();
    if (userDoc) socket.user.name = userDoc.name;
  } catch (_) {
    // ignore
  }

  socketManager.addSocket(userId, socket.id);
  logger.info(`Socket connected user=${userId} sid=${socket.id}`);

  // Persist a session row (best-effort)
  SocketSessionModel.create({ userId, socketId: socket.id }).catch(() => {});

  // Presence: mark online (broadcasts presence:online via subscriber)
  try {
    await markOnline(userId);
  } catch (err) {
    logger.warn('markOnline failed:', err?.message);
  }

  // Send presence snapshot to the connecting client.
  socket.emit(SOCKET_EVENTS.PRESENCE_SNAPSHOT, {
    onlineUserIds: socketManager.getOnlineUserIds(),
  });

  registerEvents(io, socket);

  socket.on('disconnect', () => onDisconnect(io, socket));
}

function registerEvents(io, socket) {
  const userId = socket.user.id;

  socket.on(SOCKET_EVENTS.CHAT_JOIN, ({ chatId } = {}) => {
    if (!chatId) return;
    socket.join(`chat:${chatId}`);
  });

  socket.on(SOCKET_EVENTS.CHAT_LEAVE, ({ chatId } = {}) => {
    if (!chatId) return;
    socket.leave(`chat:${chatId}`);
  });

  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async ({ chatId, content, tempId } = {}, ack) => {
    try {
      const message = await createMessage({ senderId: userId, chatId, content });
      const payload = { tempId, message };
      socket.emit(SOCKET_EVENTS.MESSAGE_ACK, payload);
      if (typeof ack === 'function') ack({ success: true, data: payload });
    } catch (err) {
      const errorPayload = {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message || 'Failed to send message',
      };
      socket.emit(SOCKET_EVENTS.ERROR, errorPayload);
      if (typeof ack === 'function') ack({ success: false, error: errorPayload });
    }
  });

  socket.on(SOCKET_EVENTS.MESSAGE_READ, async ({ messageId } = {}) => {
    if (!messageId) return;
    try {
      await markMessageRead({ userId, messageId });
    } catch (err) {
      socket.emit(SOCKET_EVENTS.ERROR, {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message,
      });
    }
  });

  socket.on(SOCKET_EVENTS.CHAT_READ_ALL, async ({ chatId } = {}) => {
    if (!chatId) return;
    try {
      await markChatReadAll({ userId, chatId });
    } catch (err) {
      socket.emit(SOCKET_EVENTS.ERROR, {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message,
      });
    }
  });

  socket.on(SOCKET_EVENTS.TYPING_START, ({ chatId } = {}) => {
    if (!chatId) return;
    socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.TYPING_START, {
      chatId,
      userId,
      userName: socket.user.name,
    });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, ({ chatId } = {}) => {
    if (!chatId) return;
    socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.TYPING_STOP, {
      chatId,
      userId,
    });
  });
}

async function onDisconnect(_io, socket) {
  const { userId, lastForUser } = socketManager.removeSocket(socket.id);
  logger.info(`Socket disconnected sid=${socket.id} user=${userId} last=${lastForUser}`);

  SocketSessionModel.updateOne(
    { socketId: socket.id },
    { $set: { disconnectedAt: new Date() } }
  ).catch(() => {});

  if (lastForUser && userId) {
    try {
      const updated = await markOffline(userId);
      emitToAll('presence:offline', {
        userId,
        lastSeen: updated?.lastSeen || new Date().toISOString(),
      });
    } catch (err) {
      logger.warn('markOffline failed:', err?.message);
    }
  }
}
