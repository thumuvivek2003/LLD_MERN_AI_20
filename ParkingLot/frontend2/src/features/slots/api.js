import { parkingService } from '../../services/parking.service.js';

export const slotsApi = {
  listByLot: (lotId) => parkingService.listSlotsByLot(lotId),
  create: (payload) => parkingService.createSlot(payload),
  setMaintenance: (slotId, on) => parkingService.setSlotMaintenance(slotId, on),
};
