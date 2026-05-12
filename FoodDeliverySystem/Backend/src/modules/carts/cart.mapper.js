export const toCartDto = (cart) => {
  if (!cart) return { items: [], restaurantId: null, total: 0 };
  const items = (cart.items || []).map((i) => ({
    menuItemId: i.menuItemId?.toString?.() || i.menuItemId,
    name: i.name,
    price: i.price,
    imageUrl: i.imageUrl,
    quantity: i.quantity,
    subtotal: Number((i.price * i.quantity).toFixed(2)),
  }));
  const total = items.reduce((s, i) => s + i.subtotal, 0);
  return {
    id: cart._id?.toString?.() || null,
    userId: cart.userId?.toString?.() || null,
    restaurantId: cart.restaurantId ? cart.restaurantId.toString() : null,
    items,
    total: Number(total.toFixed(2)),
  };
};
