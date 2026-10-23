import { parkingLotApi } from '../api/parkingLot.api.js';

export class ParkingLotFeatureService {
  constructor(api = parkingLotApi) {
    this.api = api;
  }
  list = () => this.api.list();
  get = (id) => this.api.get(id);
  create = (payload) => this.api.create(payload);
}

export const parkingLotFeatureService = new ParkingLotFeatureService();
