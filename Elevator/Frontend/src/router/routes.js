import DashboardPage from '../modules/dashboard/pages/DashboardPage.jsx';
import ElevatorSimulationPage from '../modules/elevator/pages/ElevatorSimulationPage.jsx';
import ElevatorDetailsPage from '../modules/elevator/pages/ElevatorDetailsPage.jsx';
import RequestMonitorPage from '../modules/request/pages/RequestMonitorPage.jsx';
import SettingsPage from '../modules/settings/pages/SettingsPage.jsx';

export const appRoutes = [
  { path: '/', element: DashboardPage },
  { path: '/elevators', element: ElevatorSimulationPage },
  { path: '/elevators/:id', element: ElevatorDetailsPage },
  { path: '/floors', element: DashboardPage },
  { path: '/requests', element: RequestMonitorPage },
  { path: '/strategy', element: SettingsPage },
  { path: '/logs', element: RequestMonitorPage },
  { path: '/settings', element: SettingsPage },
];
