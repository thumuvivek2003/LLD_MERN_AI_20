import { useCartContext } from '../../../core/context/CartContext.jsx';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const useCart = () => {
  const ctx = useCartContext();

  const safeAdd = async (item) => {
    try { await ctx.addToCart(item.id, 1); showSuccessToast(`${item.name} added`); }
    catch (e) { showErrorToast(e.message); }
  };

  return { ...ctx, safeAdd };
};
