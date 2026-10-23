import { VehicleFactory } from '../factories/VehicleFactory.js';
import { StrategyFactory } from '../factories/StrategyFactory.js';

export class EntryService {
  constructor({ slotRepository, slotService, ticketService }) {
    this.slotRepository = slotRepository;
    this.slotService = slotService;
    this.ticketService = ticketService;
  }

  async park({ lotId, licensePlate, vehicleType, allocation = 'NEAREST' }) {
    const vehicle = VehicleFactory.create({ licensePlate, type: vehicleType });
    const allocator = StrategyFactory.allocation(allocation, this.slotRepository);
    const slot = await allocator.allocate(lotId, vehicle.type);
    if (!slot) throw new Error('No available slot for this vehicle type');

    await this.slotService.occupy(slot._id);
    return this.ticketService.issue({
      lotId,
      slotId: slot._id,
      vehicle,
      entryTime: new Date(),
    });
  }
}
