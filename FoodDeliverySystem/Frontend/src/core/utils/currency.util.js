export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') amount = Number(amount) || 0;
  return `₹${amount.toFixed(2)}`;
};
