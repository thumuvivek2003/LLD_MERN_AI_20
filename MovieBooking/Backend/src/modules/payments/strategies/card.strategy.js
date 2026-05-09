import { generateRef } from '../../../shared/utils/generateId.js';

export const processCard = async ({ amount, cardNumber }) => {
  // Dummy card payment processing
  await new Promise(r => setTimeout(r, 500));
  return { success: true, transactionId: generateRef('CARD') };
};
