import { StrategyFactory } from '../factories/strategy.factory.js';
import { parkingLotRepository } from '../repositories/parking-lot.repository.js';
import { NotFoundError } from '../../../shared/exceptions/not-found-error.js';

export class PricingService {
  assignToLot(parkingLotId, pricingStrategy) {
    StrategyFactory.pricing(pricingStrategy);
    const lot = parkingLotRepository.findById(parkingLotId);
    if (!lot) throw new NotFoundError('Parking lot not found');
    return parkingLotRepository.update(parkingLotId, { pricingStrategy });
  }

  resolveStrategy(parkingLotId) {
    const lot = parkingLotRepository.findById(parkingLotId);
    if (!lot) throw new NotFoundError('Parking lot not found');
    return StrategyFactory.pricing(lot.pricingStrategy);
  }

  listStrategies() {
    return { pricing: StrategyFactory.pricingNames(), allocation: StrategyFactory.allocationNames() };
  }
}

export const pricingService = new PricingService();
