import EventLogList from '../../../shared/components/logs/EventLogList.jsx';
import { useElevatorStore } from '../../elevator/store/elevator.store.js';

export default function EventLogsSection({ height = 200 }) {
  const logs = useElevatorStore((s) => s.eventLogs);
  return <EventLogList logs={logs} height={height} />;
}
