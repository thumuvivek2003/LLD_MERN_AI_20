import { useElevatorStore } from '../../elevator/store/elevator.store.js';
import RequestQueueList from '../components/RequestQueueList.jsx';
import EventLogList from '../../../shared/components/logs/EventLogList.jsx';

export default function RequestMonitorPage() {
  const requests = useElevatorStore((s) => s.requests);
  const logs = useElevatorStore((s) => s.eventLogs);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section>
        <h2 className="text-base font-semibold mb-2">Requests Monitor</h2>
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-3">
          <RequestQueueList requests={requests} />
        </div>
      </section>
      <section>
        <h2 className="text-base font-semibold mb-2">Full Event Log</h2>
        <EventLogList logs={logs} height={480} />
      </section>
    </div>
  );
}
