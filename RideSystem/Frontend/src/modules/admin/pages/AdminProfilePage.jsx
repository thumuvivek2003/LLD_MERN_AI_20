import Card from '../../../core/components/ui/Card.jsx';
import { useAuth } from '../../../core/hooks/useAuth.js';

export default function AdminProfilePage() {
  const { user, signOut } = useAuth();
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 grid place-items-center text-2xl">🛡️</div>
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
      </Card>
      <Card>
        <button onClick={signOut} className="text-red-500 text-sm font-semibold">Sign out</button>
      </Card>
    </div>
  );
}
