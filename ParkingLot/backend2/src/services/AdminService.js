export class AdminService {
  constructor({ parkingLotService, slotService }) {
    this.parkingLotService = parkingLotService;
    this.slotService = slotService;
  }

  async createLot(data) {
    return this.parkingLotService.create(data);
  }

  async addSlot(data) {
    return this.slotService.create(data);
  }

  async setSlotMaintenance(slotId) {
    return this.slotService.markMaintenance(slotId);
  }
}
