// modules/status/status.controller.js — thin HTTP layer.
import { statusService } from './status.service.js';

export const statusController = {
  async createStatus(req, res, next) {
    try {
      res.status(201).json(await statusService.createStatus(req.currentUserId, req.body));
    } catch (err) {
      next(err);
    }
  },

  async getFeed(req, res, next) {
    try {
      res.json(await statusService.buildFeed(req.currentUserId));
    } catch (err) {
      next(err);
    }
  },

  async getMyStatuses(req, res, next) {
    try {
      res.json(await statusService.getMyStatuses(req.currentUserId));
    } catch (err) {
      next(err);
    }
  },

  async getUserStatuses(req, res, next) {
    try {
      res.json(await statusService.getStatuses(req.currentUserId, req.params.userId));
    } catch (err) {
      next(err);
    }
  },

  async getViewers(req, res, next) {
    try {
      res.json(await statusService.getStatusViewers(req.currentUserId, req.params.statusId));
    } catch (err) {
      next(err);
    }
  },

  async deleteStatus(req, res, next) {
    try {
      res.json(await statusService.removeStatus(req.currentUserId, req.params.statusId));
    } catch (err) {
      next(err);
    }
  },
};
