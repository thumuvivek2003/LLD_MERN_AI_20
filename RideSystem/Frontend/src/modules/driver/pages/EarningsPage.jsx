import { useEffect, useState } from 'react';
import Card from '../../../core/components/ui/Card.jsx';
import DriverEarningsCard from '../components/DriverEarningsCard.jsx';
import { earningsApi } from '../services/earnings.api.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';
import { formatDate } from '../../../core/utils/formatDate.js';

export default function EarningsPage() {
  const [data, setData] = useState({ total: 0, count: 0, payments: [] });
  useEffect(() => { earningsApi.summary().then((r) => setData(r.data)); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Earnings</h2>
      <DriverEarningsCard total={data.total} count={data.count} />
      <Card>
        <p className="font-semibold mb-3">Recent payments</p>
        <div className="divide-y divide-slate-100">
          {data.payments?.length ? data.payments.map((p) => (
            <div key={p._id} className="py-2 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{p.method}</p>
                <p className="text-xs text-slate-500">{formatDate(p.paidAt || p.createdAt)}</p>
              </div>
              <span className="font-bold">{formatCurrency(p.amount)}</span>
            </div>
          )) : <p className="text-sm text-slate-400 text-center py-4">No payments yet</p>}
        </div>
      </Card>
    </div>
  );
}
