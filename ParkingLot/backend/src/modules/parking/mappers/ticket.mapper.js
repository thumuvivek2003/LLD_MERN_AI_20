export const TicketMapper = {
  toResponse(ticket, { slot, vehicle, payment } = {}) {
    return {
      id: ticket.id,
      code: ticket.code,
      parkingLotId: ticket.parkingLotId,
      slot: slot ? { id: slot.id, number: slot.number, floorId: slot.floorId } : { id: ticket.slotId },
      vehicle: vehicle ? { id: vehicle.id, plate: vehicle.plate, type: vehicle.type } : { id: ticket.vehicleId },
      entryAt: ticket.entryAt,
      exitAt: ticket.exitAt,
      amount: ticket.amount,
      status: ticket.status,
      payment: payment ? { id: payment.id, status: payment.status, paidAt: payment.paidAt } : null,
    };
  },
};
