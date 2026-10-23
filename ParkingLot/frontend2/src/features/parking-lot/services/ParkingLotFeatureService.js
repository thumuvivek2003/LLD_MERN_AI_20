import { parkingLotApi } from '../api/parkingLot.api.js';

export class ParkingLotFeatureService {
  constructor(api = parkingLotApi) {
    this.api = api;
  }

  list() {
    return this.api.list();
  }

  get(id) {
    return this.api.get(id);
  }

  create(payload) {
    return this.api.create(payload);
  }

  listSlots(lotId) {
    return this.api.listSlots(lotId);
  }
}

export const parkingLotFeatureService = new ParkingLotFeatureService();
