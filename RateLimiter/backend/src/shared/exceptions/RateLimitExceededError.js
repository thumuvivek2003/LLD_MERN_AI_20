import { AppError } from './AppError.js';

export class RateLimitExceededError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitExceededError';
  }
}
