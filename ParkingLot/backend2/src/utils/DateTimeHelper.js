export const DateTimeHelper = {
  isWeekend(date = new Date()) {
    const day = date.getDay();
    return day === 0 || day === 6;
  },
  hoursBetween(start, end) {
    return Math.ceil((end - start) / (1000 * 60 * 60));
  },
};
