import Button from '../../../../shared/components/Button.jsx';

export default function UserStatusToggle({ user, loading, onBlock, onUnblock }) {
  if (user.blocked) {
    return (
      <Button size="sm" variant="secondary" disabled={loading} onClick={() => onUnblock(user._id)}>
        Unblock
      </Button>
    );
  }
  return (
    <Button size="sm" variant="danger" disabled={loading} onClick={() => onBlock(user._id)}>
      Block
    </Button>
  );
}
