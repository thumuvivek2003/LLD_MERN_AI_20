import { ParkingLot } from '../models/parking-lot.model.js';
import { Floor } from '../models/floor.model.js';
import { parkingLotRepository, floorRepository } from '../repositories/parking-lot.repository.js';
import { slotRepository } from '../repositories/slot.repository.js';
import { NotFoundError } from '../../../shared/exceptions/not-found-error.js';
import { StrategyFactory } from '../factories/strategy.factory.js';

export class ParkingLotService {
  createLot(dto) {
    if (dto.pricingStrategy) StrategyFactory.pricing(dto.pricingStrategy);
    if (dto.allocationStrategy) StrategyFactory.allocation(dto.allocationStrategy);
    return parkingLotRepository.create(new ParkingLot(dto));
  }

  getLot(id) {
    const lot = parkingLotRepository.findById(id);
    if (!lot) throw new NotFoundError('Parking lot not found');
    return lot;
  }

  listLots() {
    return parkingLotRepository.findAll();
  }

  createFloor(dto) {
    this.getLot(dto.parkingLotId);
    return floorRepository.create(new Floor(dto));
  }

  listFloors(parkingLotId) {
    this.getLot(parkingLotId);
    return floorRepository.findByLot(parkingLotId);
  }

  summary(parkingLotId) {
    const lot = this.getLot(parkingLotId);
    const floors = floorRepository.findByLot(parkingLotId);
    const slots = slotRepository.findByLot(parkingLotId);
    return { lot, floors, slotCount: slots.length };
  }
}

export const parkingLotService = new ParkingLotService();
