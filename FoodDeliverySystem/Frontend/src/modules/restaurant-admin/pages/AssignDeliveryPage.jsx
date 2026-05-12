import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/restaurant-admin.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { showSuccessToast, showErrorToast } from '../../../core/services/notification.service.js';

export const AssignDeliveryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState('NEAREST');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getPartners().then((r) => setPartners(r.data || []));
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      await api.assignDeliveryPartner(id, strategy);
      showSuccessToast('Delivery partner assigned');
      navigate(`/restaurant/orders/${id}`);
    } catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!partners) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-3">Assign Delivery Partner</h1>
      <div className="card p-5">
        <p className="text-gray-600 mb-4 text-sm">Pick an assignment strategy. The system applies your strategy to find a partner.</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { v: 'NEAREST', label: 'Nearest', desc: 'By distance to restaurant', icon: '📍' },
            { v: 'BEST_RATED', label: 'Best Rated', desc: 'By partner rating', icon: '⭐' },
          ].map((o) => (
            <label key={o.v} className={`p-4 border rounded-lg cursor-pointer ${strategy === o.v ? 'border-brand bg-brand-light' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="strategy" value={o.v} checked={strategy === o.v} onChange={() => setStrategy(o.v)} className="hidden" />
              <div className="text-2xl">{o.icon}</div>
              <div className="font-semibold mt-1">{o.label}</div>
              <div className="text-xs text-gray-500">{o.desc}</div>
            </label>
          ))}
        </div>

        <h3 className="font-semibold mb-2 text-sm">Available partners ({partners.filter((p) => p.status === 'AVAILABLE').length})</h3>
        <div className="text-sm space-y-1 mb-4">
          {partners.slice(0, 5).map((p) => (
            <div key={p._id} className="flex justify-between border-b py-1.5">
              <span>{p.name}</span>
              <span className="text-gray-500">★ {p.rating} · {p.status}</span>
            </div>
          ))}
        </div>

        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? 'Assigning…' : 'Assign Partner'}
        </Button>
      </div>
    </div>
  );
};
