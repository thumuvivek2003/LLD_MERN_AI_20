import { menuItemService } from './menu-item.service.js';
import { successResponse } from '../../core/utils/response.util.js';

export const createMenuItem = async (req, res, next) => {
  try {
    const item = await menuItemService.createMenuItem(req.body);
    successResponse(res, item, 'Created', 201);
  } catch (err) { next(err); }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await menuItemService.updateMenuItem(req.params.id, req.body);
    successResponse(res, item, 'Updated');
  } catch (err) { next(err); }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await menuItemService.toggleAvailability(req.params.id);
    successResponse(res, item, 'Toggled');
  } catch (err) { next(err); }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const result = await menuItemService.deleteMenuItem(req.params.id);
    successResponse(res, result, 'Deleted');
  } catch (err) { next(err); }
};

export const getRestaurantMenu = async (req, res, next) => {
  try {
    const list = await menuItemService.getMenuByRestaurant(req.params.restaurantId, {
      availableOnly: req.query.available === 'true',
    });
    successResponse(res, list);
  } catch (err) { next(err); }
};

export const getMenuItem = async (req, res, next) => {
  try {
    const item = await menuItemService.getMenuItemById(req.params.id);
    successResponse(res, item);
  } catch (err) { next(err); }
};
