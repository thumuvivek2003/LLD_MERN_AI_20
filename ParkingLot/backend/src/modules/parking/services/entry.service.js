import { CreateTicketDto } from '../dtos/create-ticket.dto.js';
import { VehicleFactory } from '../factories/vehicle.factory.js';
import { StrategyFactory } from '../factories/strategy.factory.js';
import { vehicleRepository } from '../repositories/ticket.repository.js';
import { slotRepository } from '../repositories/slot.repository.js';
import { parkingLotRepository } from '../repositories/parking-lot.repository.js';
import { slotService } from './slot.service.js';
import { ticketService } from './ticket.service.js';
import { TicketMapper } from '../mappers/ticket.mapper.js';
import { NotFoundError } from '../../../shared/exceptions/not-found-error.js';
import { AppError } from '../../../shared/exceptions/app-error.js';

export class EntryService {
  enter(input) {
    const dto = new CreateTicketDto(input);
    const lot = parkingLotRepository.findById(dto.parkingLotId);
    if (!lot) throw new NotFoundError('Parking lot not found');

    const available = slotRepository.findAvailable(dto.parkingLotId, dto.vehicleType);
    const allocator = StrategyFactory.allocation(lot.allocationStrategy);
    const slot = allocator.allocate(available);
    if (!slot) throw new AppError('No slots available for this vehicle type', 409);

    const vehicle = vehicleRepository.findByPlate(dto.plate)
      ?? vehicleRepository.create(VehicleFactory.create({ plate: dto.plate, type: dto.vehicleType }));

    slotService.occupy(slot.id);

    const ticket = ticketService.open({
      parkingLotId: lot.id,
      slotId: slot.id,
      vehicleId: vehicle.id,
    });

    return TicketMapper.toResponse(ticket, { slot, vehicle });
  }
}

export const entryService = new EntryService();
