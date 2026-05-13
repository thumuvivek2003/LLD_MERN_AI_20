export const DriverMapper = {
  toDto(driver) {
    if (!driver) return null;
    const u = driver.user && driver.user.toSafeJSON ? driver.user.toSafeJSON() : driver.user;
    return {
      id: driver._id,
      user: u,
      license: driver.license,
      status: driver.status,
      rating: driver.rating,
      totalTrips: driver.totalTrips,
      totalEarnings: driver.totalEarnings,
      currentLocation: driver.currentLocation,
      activeVehicle: driver.activeVehicle || null,
    };
  },
  toList: (drivers = []) => drivers.map((d) => DriverMapper.toDto(d)),
};
