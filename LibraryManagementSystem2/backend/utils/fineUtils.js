export const formatFineAmount = (amount) => `$${amount.toFixed(2)}`;

export const isFineEligible = (returnDate, dueDate) => {
  return new Date(returnDate) > new Date(dueDate);
};
