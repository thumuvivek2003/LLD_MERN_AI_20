import { calcOverdueDays } from './dueDateUtils.js';

export const computeFine = (dueDate, ratePerDay = 5) => {
  return calcOverdueDays(dueDate) * ratePerDay;
};
