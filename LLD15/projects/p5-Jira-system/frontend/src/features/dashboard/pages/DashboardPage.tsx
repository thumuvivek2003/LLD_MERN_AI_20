import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useBoardStore } from '../../../store/useBoardStore';
import { usePermission } from '../../../hooks/usePermission';
import { CreateBoardModal } from '../components/CreateBoardModal';
import { BoardCard } from '../components/BoardCard';
import { LayoutGrid, LogOut, Shield, Plus } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const boards = useBoardStore((s) => s.boards);
  const navigate = useNavigate();
  const canCreate = usePermission('board:create');
  const [showCreate, setShowCreate] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const myBoards = boards.filter(
    (b) => b.ownerId === user.id || b.members.some((m) => m.userId === user.id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Boards</span>
        </div>
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
          )}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Your Boards</h2>
          {canCreate && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> New Board
            </button>
          )}
        </div>

        {myBoards.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <LayoutGrid className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No boards yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBoards.map((board, i) => (
              <div key={board.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <BoardCard board={board} onClick={() => navigate(`/boards/${board.id}`)} />
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreate && <CreateBoardModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
