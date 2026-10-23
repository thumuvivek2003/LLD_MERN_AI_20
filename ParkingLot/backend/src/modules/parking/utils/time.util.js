export const HOUR_MS = 60 * 60 * 1000;

export const hoursBetween = (startMs, endMs) => (endMs - startMs) / HOUR_MS;

export const isWeekend = (date = new Date()) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
