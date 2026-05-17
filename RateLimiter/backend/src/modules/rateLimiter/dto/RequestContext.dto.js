export class RequestContext {
  constructor({ clientId, endpoint = '/', timestamp = Date.now() }) {
    this.clientId = clientId;
    this.endpoint = endpoint;
    this.timestamp = timestamp;
  }
}

export function buildRequestContext({ clientId, endpoint }) {
  return new RequestContext({ clientId, endpoint });
}
