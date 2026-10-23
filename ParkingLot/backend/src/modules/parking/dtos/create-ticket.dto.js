export class CreateTicketDto {
  constructor({ parkingLotId, plate, vehicleType }) {
    this.parkingLotId = parkingLotId;
    this.plate = plate;
    this.vehicleType = vehicleType;
  }
}
