import { rateLimiterService } from '../services/rateLimiter.service.js';
import { buildRequestContext } from '../dto/RequestContext.dto.js';

export async function handleRateLimit(req, res, next) {
  try {
    const clientId = req.client.clientId;
    const endpoint = (req.body && req.body.endpoint) || req.originalUrl || '/';
    const context = buildRequestContext({ clientId, endpoint });
    const response = await rateLimiterService.processRequest(context);
    const status = response.allowed ? 200 : 429;
    return res.status(status).json(response);
  } catch (err) {
    return next(err);
  }
}
