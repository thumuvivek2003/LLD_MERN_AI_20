import { auctionService } from '../services/auction.service.js';
import { bidService } from '../services/bid.service.js';
import {
  createAuctionSchema,
  assignBiddersSchema,
  listAuctionsSchema,
} from '../dtos/auction.dto.js';
import { placeBidSchema } from '../dtos/bid.dto.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const auctionController = {
  async createAuction(req, res, next) {
    try {
      const body = createAuctionSchema.parse(req.body);
      const auction = await auctionService.createAuction(body, req.user);
      return successResponse(res, { auction }, 201);
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const query = listAuctionsSchema.parse(req.query);
      const result = await auctionService.list(query);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  async getLiveAuctions(_req, res, next) {
    try {
      const auctions = await auctionService.getLive();
      return successResponse(res, { auctions });
    } catch (err) {
      next(err);
    }
  },

  async getAuctionById(req, res, next) {
    try {
      const result = await auctionService.getAuctionDetails(req.params.id);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  async closeAuction(req, res, next) {
    try {
      const auction = await auctionService.closeAuction(req.params.id);
      return successResponse(res, { auction });
    } catch (err) {
      next(err);
    }
  },

  async assignBidders(req, res, next) {
    try {
      const { userIds } = assignBiddersSchema.parse(req.body);
      const auction = await auctionService.assignEligibleUsers(req.params.id, userIds);
      return successResponse(res, { auction });
    } catch (err) {
      next(err);
    }
  },

  async myBids(req, res, next) {
    try {
      const auctions = await auctionService.getMyBids(req.user.id);
      return successResponse(res, { auctions });
    } catch (err) {
      next(err);
    }
  },

  async myWins(req, res, next) {
    try {
      const auctions = await auctionService.getMyWins(req.user.id);
      return successResponse(res, { auctions });
    } catch (err) {
      next(err);
    }
  },

  async placeBid(req, res, next) {
    try {
      const { amount } = placeBidSchema.parse(req.body);
      const result = await bidService.placeBid({
        auctionId: req.params.id,
        user: req.user,
        amount,
      });
      return successResponse(res, result, 201);
    } catch (err) {
      next(err);
    }
  },

  async getBids(req, res, next) {
    try {
      const bids = await bidService.getAuctionBids(req.params.id);
      return successResponse(res, { bids });
    } catch (err) {
      next(err);
    }
  },
};
