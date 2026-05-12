import { useEffect, useState } from 'react';
import * as api from '../services/delivery.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { useAuthContext } from '../../../core/context/AuthContext.jsx';

export const DeliveryProfilePage = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  useEffect(() => { api.getMyProfile().then((r) => setProfile(r.data)); }, []);

  if (!profile) return <Loader />;
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-3">Profile</h1>
      <div className="card p-5 space-y-2 text-sm">
        <div><span className="text-gray-500">Name:</span> {user.name}</div>
        <div><span className="text-gray-500">Email:</span> {user.email}</div>
        <div><span className="text-gray-500">Phone:</span> {user.phoneNumber}</div>
        <div><span className="text-gray-500">Rating:</span> ★ {profile.rating}</div>
        <div><span className="text-gray-500">Status:</span> {profile.status}</div>
      </div>
    </div>
  );
};
