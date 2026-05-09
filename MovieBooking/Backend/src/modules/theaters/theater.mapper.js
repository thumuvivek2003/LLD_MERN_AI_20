export const toDto = (theater) => ({
  id: theater._id,
  name: theater.name,
  city: theater.city,
  address: theater.address,
  totalScreens: theater.totalScreens,
});
