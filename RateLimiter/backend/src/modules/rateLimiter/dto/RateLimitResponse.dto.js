export function buildRateLimitResponse({
  allowed,
  remainingTokens,
  resetAfterSeconds,
  strategy,
  message,
}) {
  const body = {
    allowed: Boolean(allowed),
    remainingTokens: Math.max(0, Math.floor(remainingTokens ?? 0)),
    resetAfterSeconds: Math.max(0, Math.ceil(resetAfterSeconds ?? 0)),
    strategy,
  };
  if (message) body.message = message;
  return body;
}
