import { RideState } from './ride-state.interface.js';
import { RIDE_STATUS } from '../../../config/constants.js';

export class CompletedState extends RideState {
  constructor() { super(RIDE_STATUS.COMPLETED); }
  // Terminal: all actions denied
}
