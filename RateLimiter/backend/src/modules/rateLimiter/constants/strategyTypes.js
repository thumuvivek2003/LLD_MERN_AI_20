export const STRATEGY_TYPES = {
  FIXED_WINDOW: 'FIXED_WINDOW',
  SLIDING_WINDOW: 'SLIDING_WINDOW',
  TOKEN_BUCKET: 'TOKEN_BUCKET',
};

export const STRATEGY_CATALOG = [
  {
    type: STRATEGY_TYPES.FIXED_WINDOW,
    name: 'Fixed Window',
    description: 'Counts requests inside a fixed time window. Simple and memory-cheap.',
  },
  {
    type: STRATEGY_TYPES.SLIDING_WINDOW,
    name: 'Sliding Window',
    description: 'Tracks request timestamps over a moving window. Smoother than fixed window.',
  },
  {
    type: STRATEGY_TYPES.TOKEN_BUCKET,
    name: 'Token Bucket',
    description: 'Bucket refills at a steady rate. Allows bursts up to capacity.',
  },
];
