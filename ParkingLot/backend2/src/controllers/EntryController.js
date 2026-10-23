export class EntryController {
  constructor(entryService) {
    this.entryService = entryService;
  }

  park = async (req, res, next) => {
    try {
      const ticket = await this.entryService.park(req.body);
      res.status(201).json(ticket);
    } catch (e) { next(e); }
  };
}
