export const SlotMapper = {
  toResponse(slot) {
    return {
      id: slot.id,
      number: slot.number,
      floorId: slot.floorId,
      parkingLotId: slot.parkingLotId,
      vehicleType: slot.vehicleType,
      status: slot.status,
      distanceFromEntry: slot.distanceFromEntry,
    };
  },
};
