/**
 * Thrown by every interface method in core/interfaces so that a half-finished
 * implementation fails loudly instead of silently returning undefined.
 */
export class NotImplementedError extends Error {
  constructor(member = 'method') {
    super(`${member} must be implemented by the concrete class`);
    this.name = 'NotImplementedError';
    this.statusCode = 500;
    this.code = 'INTERNAL_ERROR';
  }
}
