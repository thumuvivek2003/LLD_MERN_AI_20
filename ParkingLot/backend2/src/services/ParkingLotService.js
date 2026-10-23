export class ParkingLotService {
  constructor(parkingLotRepository) {
    this.parkingLotRepository = parkingLotRepository;
  }

  async create(data) {
    return this.parkingLotRepository.create(data);
  }

  async list() {
    return this.parkingLotRepository.findAll();
  }

  async findById(id) {
    return this.parkingLotRepository.findById(id);
  }
}
