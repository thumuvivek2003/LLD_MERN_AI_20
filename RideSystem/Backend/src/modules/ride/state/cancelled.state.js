import { RideState } from './ride-state.interface.js';
import { RIDE_STATUS } from '../../../config/constants.js';

export class CancelledState extends RideState {
  constructor() { super(RIDE_STATUS.CANCELLED); }
  // Terminal
}
