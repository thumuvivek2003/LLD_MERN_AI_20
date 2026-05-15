import { Outlet } from 'react-router-dom';

export default function SimulationLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 p-4">
      <Outlet />
    </div>
  );
}
