import { processUpi } from './strategies/upi.strategy.js';
import { processCard } from './strategies/card.strategy.js';
import { processWallet } from './strategies/wallet.strategy.js';

const strategies = { upi: processUpi, card: processCard, wallet: processWallet };

export const getStrategy = (method) => {
  const strategy = strategies[method];
  if (!strategy) throw Object.assign(new Error(`Unsupported payment method: ${method}`), { statusCode: 400 });
  return strategy;
};
