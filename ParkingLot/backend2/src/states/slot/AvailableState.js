import { SlotState } from './SlotState.js';
import { SlotStatus } from '../../enums/SlotStatus.js';

export class AvailableState extends SlotState {
  occupy() { return SlotStatus.OCCUPIED; }
  release() { throw new Error('Slot is already available'); }
  markMaintenance() { return SlotStatus.MAINTENANCE; }
  name() { return SlotStatus.AVAILABLE; }
}
