export class SlotController {
  constructor(slotService) {
    this.slotService = slotService;
  }

  listByLot = async (req, res, next) => {
    try { res.json(await this.slotService.listByLot(req.params.lotId)); }
    catch (e) { next(e); }
  };
}
