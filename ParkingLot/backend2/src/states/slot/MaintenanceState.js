import { SlotState } from './SlotState.js';
import { SlotStatus } from '../../enums/SlotStatus.js';

export class MaintenanceState extends SlotState {
  occupy() { throw new Error('Slot under maintenance'); }
  release() { return SlotStatus.AVAILABLE; }
  markMaintenance() { throw new Error('Slot already under maintenance'); }
  name() { return SlotStatus.MAINTENANCE; }
}
