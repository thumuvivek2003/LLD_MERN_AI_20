export class ExitController {
  constructor(exitService) {
    this.exitService = exitService;
  }

  exit = async (req, res, next) => {
    try {
      const result = await this.exitService.exit(req.body);
      res.json(result);
    } catch (e) { next(e); }
  };
}
