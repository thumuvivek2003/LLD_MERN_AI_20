export const STRATEGY_TYPES = {
  FIXED_WINDOW: 'FIXED_WINDOW',
  SLIDING_WINDOW: 'SLIDING_WINDOW',
  TOKEN_BUCKET: 'TOKEN_BUCKET',
};

export const STRATEGY_LABELS = {
  FIXED_WINDOW: 'Fixed Window',
  SLIDING_WINDOW: 'Sliding Window',
  TOKEN_BUCKET: 'Token Bucket',
};

export const STRATEGY_DESCRIPTIONS = {
  FIXED_WINDOW:
    'Counts requests in discrete fixed windows. Simple and predictable.',
  SLIDING_WINDOW:
    'Tracks request timestamps over a rolling window. Smoother than fixed.',
  TOKEN_BUCKET:
    'Refills tokens at a steady rate; allows controlled bursts up to capacity.',
};
