import { cartService } from './cart.service.js';
import { successResponse } from '../../core/utils/response.util.js';

export const getCart = async (req, res, next) => {
  try { successResponse(res, await cartService.getCart(req.user.id)); }
  catch (err) { next(err); }
};

export const addItemToCart = async (req, res, next) => {
  try { successResponse(res, await cartService.addCartItem(req.user.id, req.body), 'Item added'); }
  catch (err) { next(err); }
};

export const removeItemFromCart = async (req, res, next) => {
  try { successResponse(res, await cartService.removeCartItem(req.user.id, req.params.menuItemId), 'Removed'); }
  catch (err) { next(err); }
};

export const updateQuantity = async (req, res, next) => {
  try {
    successResponse(res,
      await cartService.updateQuantity(req.user.id, req.params.menuItemId, Number(req.body.quantity)),
      'Updated'
    );
  } catch (err) { next(err); }
};

export const clearCart = async (req, res, next) => {
  try { successResponse(res, await cartService.clearCart(req.user.id), 'Cart cleared'); }
  catch (err) { next(err); }
};
