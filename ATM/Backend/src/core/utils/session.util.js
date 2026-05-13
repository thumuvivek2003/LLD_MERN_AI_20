import { getATMTimeout } from "../../config/atm.config.js";

export function isSessionExpired(lastActivityAt) {
  if (!lastActivityAt) return true;
  const ts = new Date(lastActivityAt).getTime();
  return Date.now() - ts > getATMTimeout();
}
