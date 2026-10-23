export const formatLotLabel = (lot) =>
  lot ? `${lot.name}${lot.address ? ` — ${lot.address}` : ''}` : '';
