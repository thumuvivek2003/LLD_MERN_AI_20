export class ParkingLotController {
  constructor(parkingLotService) {
    this.parkingLotService = parkingLotService;
  }

  list = async (_req, res, next) => {
    try { res.json(await this.parkingLotService.list()); }
    catch (e) { next(e); }
  };

  get = async (req, res, next) => {
    try {
      const lot = await this.parkingLotService.findById(req.params.id);
      if (!lot) return res.status(404).json({ error: 'Lot not found' });
      res.json(lot);
    } catch (e) { next(e); }
  };
}
