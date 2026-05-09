export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

export const isExpired = (date) => {
  return new Date() > new Date(date);
};
