import Badge from '../ui/Badge.jsx';
import { RIDE_STATUS_LABEL } from '../../constants/ride.constants.js';

const TONE = {
  REQUESTED: 'info',
  DRIVER_ASSIGNED: 'info',
  DRIVER_ARRIVING: 'warning',
  OTP_VERIFIED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export default function RideStatusBadge({ status }) {
  return <Badge tone={TONE[status] || 'default'}>{RIDE_STATUS_LABEL[status] || status}</Badge>;
}
