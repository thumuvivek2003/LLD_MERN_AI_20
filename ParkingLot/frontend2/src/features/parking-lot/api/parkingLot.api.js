import { parkingService } from '../../../services/parking.service.js';

export const parkingLotApi = {
  list: () => parkingService.listLots(),
  get: (id) => parkingService.getLot(id),
  create: (payload) => parkingService.createLot(payload),
  listSlots: (lotId) => parkingService.listSlotsByLot(lotId),
};
