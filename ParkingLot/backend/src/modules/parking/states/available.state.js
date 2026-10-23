import { SlotState } from './slot-state.js';
import { SlotStatus } from '../../../shared/enums/slot-status.enum.js';

export class AvailableState extends SlotState {
  occupy() { return SlotStatus.OCCUPIED; }
  toMaintenance() { return SlotStatus.MAINTENANCE; }
}
