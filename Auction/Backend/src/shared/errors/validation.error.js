import { AppError } from './app.error.js';

export class ValidationError extends AppError {
  constructor(message, code = 'VALIDATION_FAILED') {
    super(message, 400, code);
    this.name = 'ValidationError';
  }
}

export class DomainRuleError extends AppError {
  constructor(message, code = 'DOMAIN_RULE_VIOLATION') {
    super(message, 422, code);
    this.name = 'DomainRuleError';
  }
}
