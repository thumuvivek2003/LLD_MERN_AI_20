import * as repo from './payment.repository.js';
import { getStrategy } from './paymentStrategyFactory.js';

export const processPayment = async ({ userId, amount, method, details }) => {
  const payment = await repo.create({ userId, amount, method, status: 'pending' });

  try {
    const strategy = getStrategy(method);
    const result = await strategy({ amount, ...details });

    return repo.update(payment._id, { status: 'success', transactionId: result.transactionId });
  } catch (err) {
    await repo.update(payment._id, { status: 'failed' });
    throw err;
  }
};

export const getPayment = (id) => repo.findById(id);
