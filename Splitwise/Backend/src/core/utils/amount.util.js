export function roundAmount(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function distributeRemainder(shares, total) {
  if (!Array.isArray(shares) || shares.length === 0) return shares;
  const sum = shares.reduce((acc, s) => acc + s.amount, 0);
  const diff = roundAmount(total - sum);
  if (diff === 0) return shares;
  const last = shares[shares.length - 1];
  last.amount = roundAmount(last.amount + diff);
  return shares;
}

export function amountsApproxEqual(a, b, tolerance = 0.01) {
  return Math.abs(Number(a) - Number(b)) <= tolerance;
}
