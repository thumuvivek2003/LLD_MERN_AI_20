import { AppError } from '../../../shared/exceptions/app-error.js';

export class SlotState {
  occupy() { throw new AppError(`Cannot occupy from ${this.constructor.name}`, 409); }
  free() { throw new AppError(`Cannot free from ${this.constructor.name}`, 409); }
  toMaintenance() { throw new AppError(`Cannot move to maintenance from ${this.constructor.name}`, 409); }
}
