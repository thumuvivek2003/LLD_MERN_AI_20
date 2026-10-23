import { useNavigate } from 'react-router-dom';
import { useAuthStore, getAllUsers } from '../../../store/useAuthStore';
import { useBoardStore } from '../../../store/useBoardStore';
import { ArrowLeft, Users, LayoutGrid, Shield } from 'lucide-react';

export default function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const boards = useBoardStore((s) => s.boards);
  const allUsers = getAllUsers();

  if (!user || user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Shield className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">Admin Panel</span>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Users */}
        <section className="animate-fade-in">
          <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Users className="w-4 h-4" /> Users ({allUsers.length})
          </h2>
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Role</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium text-primary-foreground"
                        style={{ backgroundColor: u.avatarColor }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Boards */}
        <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4" /> Boards ({boards.length})
          </h2>
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Members</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                {boards.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => navigate(`/boards/${b.id}`)}
                  >
                    <td className="px-4 py-2.5 font-medium">{b.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{b.members.length}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
