// modules/view/view.controller.js — markViewed()
import { viewService } from './view.service.js';

export const viewController = {
  async markViewed(req, res, next) {
    try {
      res.json(await viewService.markViewed(req.params.statusId, req.currentUserId));
    } catch (err) {
      next(err);
    }
  },
};
