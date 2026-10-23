export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isExpired = (date) => {
  return new Date(date) < new Date();
};

export const now = () => {
  return new Date();
};