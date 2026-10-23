import { SlotState } from './slot-state.js';
import { SlotStatus } from '../../../shared/enums/slot-status.enum.js';

export class MaintenanceState extends SlotState {
  free() { return SlotStatus.AVAILABLE; }
}
