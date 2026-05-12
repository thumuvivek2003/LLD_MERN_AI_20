import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/customer.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';

export const OtpVerificationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id).then((r) => setOrder(r.data)).catch(() => {});
  }, [id]);

  if (!order) return <Loader />;

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6 text-center">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="text-2xl font-bold mb-2">Delivery OTP</h1>
        <p className="text-gray-500 text-sm mb-6">
          Share this OTP with your delivery partner when they arrive at your doorstep.
        </p>
        <div className="bg-brand-light text-brand-dark py-6 rounded-xl mb-6">
          <div className="text-sm">Order #{order.id.slice(-6)}</div>
          <div className="text-4xl font-extrabold tracking-widest mt-2">
            {order.hasOtp ? '••••' : '----'}
          </div>
          <div className="text-xs mt-2 opacity-80">
            {order.hasOtp ? 'OTP sent via notification (check server logs in dev)' : 'OTP will appear when out for delivery'}
          </div>
        </div>
        <Link to={`/customer/orders/${order.id}`} className="btn-outline w-full">
          Back to tracking
        </Link>
      </div>
    </div>
  );
};
