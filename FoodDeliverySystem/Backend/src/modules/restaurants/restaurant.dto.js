export const buildRestaurantDto = (r) => ({
  id: r._id?.toString?.() || r.id,
  name: r.name,
  description: r.description,
  address: r.address,
  latitude: r.latitude,
  longitude: r.longitude,
  rating: r.rating,
  imageUrl: r.imageUrl,
  isActive: r.isActive,
  managedBy: r.managedBy ? r.managedBy.toString?.() || r.managedBy : null,
  createdAt: r.createdAt,
});
