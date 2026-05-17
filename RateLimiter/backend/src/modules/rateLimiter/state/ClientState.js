export class ClientState {
  constructor(clientId) {
    this.clientId = clientId;
    this.requestCount = 0;
    this.windowStart = 0;
    this.timestamps = [];
    this.tokens = 0;
    this.lastRefill = 0;
    this.allowedCount = 0;
    this.blockedCount = 0;
  }

  incrementRequests() {
    this.requestCount += 1;
  }

  resetWindow(nowMs = Date.now()) {
    this.requestCount = 0;
    this.windowStart = nowMs;
    this.timestamps = [];
  }

  consumeToken() {
    if (this.tokens <= 0) return false;
    this.tokens -= 1;
    return true;
  }
}
