import { generateRef } from '../../../shared/utils/generateId.js';

export const processWallet = async ({ amount }) => {
  // Dummy wallet payment processing
  await new Promise(r => setTimeout(r, 300));
  return { success: true, transactionId: generateRef('WAL') };
};
