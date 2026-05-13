import { socketService } from '../../../core/services/socket.service.js';

export const driverTrackingApi = {
  emitLocation(payload) {
    socketService.emit('driver:location:update', payload);
  },
};
