export const calculateDistanceLabel = (km) => {
  if (km == null || km === Infinity) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
};
