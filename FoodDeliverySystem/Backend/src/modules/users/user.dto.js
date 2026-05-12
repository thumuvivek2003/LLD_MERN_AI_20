export const buildUserDto = (user) => ({
  id: user._id?.toString?.() || user.id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber || null,
  address: user.address || null,
  role: user.role,
  isBlocked: user.isBlocked,
  rating: user.rating,
  location: user.location || { lat: null, lng: null },
  createdAt: user.createdAt,
});
