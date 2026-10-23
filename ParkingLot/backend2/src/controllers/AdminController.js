export class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  createLot = async (req, res, next) => {
    try { res.status(201).json(await this.adminService.createLot(req.body)); }
    catch (e) { next(e); }
  };

  addSlot = async (req, res, next) => {
    try { res.status(201).json(await this.adminService.addSlot(req.body)); }
    catch (e) { next(e); }
  };

  setMaintenance = async (req, res, next) => {
    try { res.json(await this.adminService.setSlotMaintenance(req.params.slotId)); }
    catch (e) { next(e); }
  };
}
