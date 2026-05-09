import Button from '../../../shared/components/ui/Button.jsx';

export default function UserStatusToggle({ user, onActivate, onDeactivate }) {
  const isActive = user.status === 'ACTIVE';
  return (
    <Button
      variant={isActive ? 'danger' : 'success'}
      onClick={() => (isActive ? onDeactivate(user._id) : onActivate(user._id))}
    >
      {isActive ? 'Deactivate' : 'Activate'}
    </Button>
  );
}
