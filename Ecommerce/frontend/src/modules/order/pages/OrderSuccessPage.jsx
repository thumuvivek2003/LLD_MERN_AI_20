import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button.jsx';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-12">
      <div className="card max-w-md w-full text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h2>
        <p className="text-sm text-slate-500 mt-2">
          Thank you for shopping with us. Your order has been confirmed.
        </p>
        <div className="bg-slate-50 rounded-xl p-3 mt-5">
          <p className="text-xs text-slate-500">Order ID</p>
          <p className="font-mono text-sm font-semibold mt-1 break-all">{id}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button className="w-full" onClick={() => navigate(`/orders/${id}`)}>
            View Order
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
