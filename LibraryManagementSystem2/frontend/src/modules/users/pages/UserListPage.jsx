import { useUsers } from '../hooks/useUsers.js';
import UserTable from '../components/UserTable.jsx';
import AddUserModal from '../components/AddUserModal.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import Loader from '../../../shared/components/ui/Loader.jsx';
import { useModal } from '../../../shared/hooks/useModal.js';
import { activateUser, deactivateUser } from '../services/userService.js';

export default function UserListPage() {
  const { users, loading, refetch } = useUsers();
  const addModal = useModal();

  const handleActivate = async (id) => { await activateUser(id); refetch(); };
  const handleDeactivate = async (id) => { await deactivateUser(id); refetch(); };

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Users</h1>
        <Button onClick={addModal.open}>+ Add User</Button>
      </div>
      <UserTable users={users} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      <AddUserModal isOpen={addModal.isOpen} onClose={addModal.close} onAdded={refetch} />
    </div>
  );
}
