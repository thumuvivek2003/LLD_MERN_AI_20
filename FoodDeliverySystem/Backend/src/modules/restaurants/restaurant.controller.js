import { restaurantService } from './restaurant.service.js';
import { successResponse } from '../../core/utils/response.util.js';

export const createRestaurant = async (req, res, next) => {
  try {
    const r = await restaurantService.createRestaurant(req.body);
    successResponse(res, r, 'Created', 201);
  } catch (err) { next(err); }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const r = await restaurantService.updateRestaurant(req.params.id, req.body);
    successResponse(res, r, 'Updated');
  } catch (err) { next(err); }
};

export const getRestaurants = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const list = (lat || lng)
      ? await restaurantService.getNearbyRestaurants({ lat, lng })
      : await restaurantService.getAllRestaurants();
    successResponse(res, list);
  } catch (err) { next(err); }
};

export const getRestaurant = async (req, res, next) => {
  try {
    const r = await restaurantService.getRestaurantById(req.params.id);
    successResponse(res, r);
  } catch (err) { next(err); }
};

export const assignRestaurantAdmin = async (req, res, next) => {
  try {
    const r = await restaurantService.assignAdminToRestaurant(req.params.id, req.body.adminUserId);
    successResponse(res, r, 'Admin assigned');
  } catch (err) { next(err); }
};

export const getMyRestaurant = async (req, res, next) => {
  try {
    const r = await restaurantService.getRestaurantByManager(req.user.id);
    successResponse(res, r);
  } catch (err) { next(err); }
};
