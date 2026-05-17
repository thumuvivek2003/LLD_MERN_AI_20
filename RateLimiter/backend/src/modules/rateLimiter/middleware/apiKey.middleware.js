import { clientRepository } from '../repositories/client.repository.js';
import { UnauthorizedError } from '../../../shared/exceptions/UnauthorizedError.js';
import { AppError } from '../../../shared/exceptions/AppError.js';

export async function validateApiKey(req, _res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) throw new UnauthorizedError('Missing x-api-key header');
    const client = await clientRepository.findByApiKey(apiKey);
    if (!client) throw new UnauthorizedError('Invalid API key');
    if (client.status === 'blocked') {
      throw new AppError('Client is blocked', 403, 'CLIENT_BLOCKED');
    }
    req.client = client;
    next();
  } catch (err) {
    next(err);
  }
}
