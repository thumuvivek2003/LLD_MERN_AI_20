const userDto = (u) => (u && u.toSafeJSON ? u.toSafeJSON() : u);

export const RideMapper = {
  toDto(ride) {
    if (!ride) return null;
    return {
      id: ride._id,
      rider: userDto(ride.rider),
      driver: userDto(ride.driver),
      vehicle: ride.vehicle,
      pickup: ride.pickup,
      drop: ride.drop,
      distanceKm: ride.distanceKm,
      fare: ride.fare,
      status: ride.status,
      otp: ride.otp,
      paymentStatus: ride.paymentStatus,
      requestedAt: ride.requestedAt,
      assignedAt: ride.assignedAt,
      arrivedAt: ride.arrivedAt,
      startedAt: ride.startedAt,
      completedAt: ride.completedAt,
      cancelledAt: ride.cancelledAt,
      cancelledBy: ride.cancelledBy,
      createdAt: ride.createdAt,
    };
  },
  toList: (rides = []) => rides.map((r) => RideMapper.toDto(r)),

  // For driver, hide OTP until trip is fully verified? Per spec driver enters OTP, so they see it via rider. Keep simple.
  toDriverDto(ride) {
    const dto = RideMapper.toDto(ride);
    if (dto) dto.otp = undefined;
    return dto;
  },
};
