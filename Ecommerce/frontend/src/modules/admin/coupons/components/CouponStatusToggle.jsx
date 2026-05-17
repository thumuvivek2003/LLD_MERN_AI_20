import Button from '../../../../shared/components/Button.jsx';

export default function CouponStatusToggle({ coupon, loading, onToggle }) {
  return (
    <Button
      size="sm"
      variant={coupon.active ? 'danger' : 'secondary'}
      disabled={loading}
      onClick={() => onToggle(coupon._id)}
    >
      {coupon.active ? 'Deactivate' : 'Activate'}
    </Button>
  );
}
