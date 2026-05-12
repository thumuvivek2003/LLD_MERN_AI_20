import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/delivery.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { StatusBadge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { showSuccessToast, showErrorToast } from '../../../core/services/notification.service.js';

export const PickupVerificationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.getOrder(id).then((r) => setOrder(r.data)); }, [id]);

  const confirmPickup = async () => {
    setLoading(true);
    try { await api.acceptDelivery(id); showSuccessToast('Picked up'); navigate(`/delivery/otp/${id}`); }
    catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!order) return <Loader />;
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-3">Pickup Verification</h1>
      <div className="card p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">Order #{order.id.slice(-6)}</div>
            <div className="text-sm text-gray-500">{order.items.length} items · {formatCurrency(order.totalAmount)}</div>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="mt-3 text-sm">📍 Drop-off: {order.deliveryAddress}</div>
        <Button onClick={confirmPickup} disabled={loading} className="w-full mt-4">
          {loading ? 'Confirming…' : 'Confirm pickup → Start delivery'}
        </Button>
      </div>
    </div>
  );
};
