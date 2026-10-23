import { parkingService } from '../../services/parking.service.js';
import { paymentService } from '../../services/payment.service.js';

export const ticketsApi = {
  park: (payload) => parkingService.parkVehicle(payload),
  exit: (payload) => paymentService.exitVehicle(payload),
};
