import { AppError } from './app.error.js';

export class RideError extends AppError {
  constructor(message = 'Ride error', statusCode = 400) {
    super(message, statusCode, 'RIDE_ERROR');
  }
}

export class InvalidStateTransition extends RideError {
  constructor(from, to) {
    super(`Cannot transition ride from ${from} to ${to}`, 409);
  }
}
