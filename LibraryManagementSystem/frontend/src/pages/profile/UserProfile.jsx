import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone },
  });

  const mutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: async () => {
      await refreshUser();
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed.'),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account information</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge label={user?.role} />
              <span className="text-xs text-gray-400">Member ID: {user?.membershipId}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <p className="text-xs text-gray-500">Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : '—'}</p>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <h3 className="font-medium text-gray-900">Update Profile</h3>
          <Input label="Full Name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input label="Phone" type="tel" placeholder="+1 234 567 8900" {...register('phone')} />
          <div className="flex justify-end">
            <Button type="submit" loading={mutation.isPending}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
