import StrategySelector from '../components/StrategySelector.jsx';
import SimulationSpeedSelector from '../components/SimulationSpeedSelector.jsx';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-lg font-semibold">Settings</h2>
      <section className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-4">
        <StrategySelector />
      </section>
      <section className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-4">
        <SimulationSpeedSelector />
      </section>
    </div>
  );
}
