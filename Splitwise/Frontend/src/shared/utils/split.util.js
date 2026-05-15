export function roundAmount(n) {
  return Math.round(Number(n) * 100) / 100;
}

export function calculateEqualSplit(amount, participants) {
  const total = Number(amount) || 0;
  const n = participants.length;
  if (n === 0) return {};
  const base = Math.floor((total * 100) / n) / 100;
  const shares = {};
  let acc = 0;
  participants.forEach((uid, i) => {
    if (i === n - 1) {
      shares[uid] = roundAmount(total - acc);
    } else {
      shares[uid] = base;
      acc = roundAmount(acc + base);
    }
  });
  return shares;
}

export function validateSplitSum(amount, sharesMap, tolerance = 0.01) {
  const total = Number(amount) || 0;
  const sum = Object.values(sharesMap).reduce((s, v) => s + (Number(v) || 0), 0);
  return Math.abs(sum - total) <= tolerance;
}

export function validatePercentSum(percentsMap, tolerance = 0.01) {
  const sum = Object.values(percentsMap).reduce((s, v) => s + (Number(v) || 0), 0);
  return Math.abs(sum - 100) <= tolerance;
}

export function sumValues(map) {
  return Object.values(map).reduce((s, v) => s + (Number(v) || 0), 0);
}
