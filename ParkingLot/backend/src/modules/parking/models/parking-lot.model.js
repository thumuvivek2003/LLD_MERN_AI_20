import { CONSTANTS } from '../../../config/constants.js';

export class ParkingLot {
  constructor({ id, name, address, pricingStrategy = CONSTANTS.DEFAULT_PRICING, allocationStrategy = CONSTANTS.DEFAULT_ALLOCATION }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.pricingStrategy = pricingStrategy;
    this.allocationStrategy = allocationStrategy;
  }
}
