export function isAuctionExpired(endTime, now = new Date()) {
  return new Date(endTime).getTime() <= now.getTime();
}

export function isWithinWindow(startTime, endTime, now = new Date()) {
  const t = now.getTime();
  return t >= new Date(startTime).getTime() && t <= new Date(endTime).getTime();
}
