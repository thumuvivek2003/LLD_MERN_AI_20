import { generateRef } from '../../../shared/utils/generateId.js';

export const processUpi = async ({ amount, upiId }) => {
  // Dummy UPI payment processing
  await new Promise(r => setTimeout(r, 500));
  return { success: true, transactionId: generateRef('UPI') };
};
