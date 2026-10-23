import { SlotState } from './SlotState.js';
import { SlotStatus } from '../../enums/SlotStatus.js';

export class OccupiedState extends SlotState {
  occupy() { throw new Error('Slot is already occupied'); }
  release() { return SlotStatus.AVAILABLE; }
  markMaintenance() { throw new Error('Cannot mark occupied slot for maintenance'); }
  name() { return SlotStatus.OCCUPIED; }
}
