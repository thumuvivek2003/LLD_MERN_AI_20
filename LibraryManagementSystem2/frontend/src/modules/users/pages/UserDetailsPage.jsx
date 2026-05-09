import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUser, activateUser, deactivateUser, assignRole } from '../services/userService.js';
import Loader from '../../../shared/components/ui/Loader.jsx';
import UserStatusToggle from '../components/UserStatusToggle.jsx';
import RoleSelector from '../components/RoleSelector.jsx';

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    getUser(id).then(({ data }) => setUser(data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, [id]);

  const handleRoleChange = async (role) => { await assignRole(id, role); refresh(); };

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <h1 className="page-title">{user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <UserStatusToggle user={user} onActivate={activateUser} onDeactivate={deactivateUser} />
        <RoleSelector value={user?.role} onChange={handleRoleChange} />
      </div>
    </div>
  );
}
