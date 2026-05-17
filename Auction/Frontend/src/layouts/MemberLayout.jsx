import { Outlet } from 'react-router-dom';
import MemberNavbar from '../modules/member/components/MemberNavbar.jsx';

export default function MemberLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MemberNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
