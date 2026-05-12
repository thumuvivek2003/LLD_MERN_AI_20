export const buildMenuItemDto = (m) => ({
  id: m._id?.toString?.() || m.id,
  restaurantId: m.restaurantId?.toString?.() || m.restaurantId,
  name: m.name,
  description: m.description,
  price: m.price,
  imageUrl: m.imageUrl,
  category: m.category,
  isVeg: m.isVeg,
  isAvailable: m.isAvailable,
});
