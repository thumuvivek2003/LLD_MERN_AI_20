import { env } from "./env.config.js";

export function getATMTimeout() {
  return env.sessionTimeoutMs;
}

export function getSupportedDenominations() {
  return [2000, 500, 200, 100];
}

export function getMaxPinAttempts() {
  return env.maxPinAttempts;
}
