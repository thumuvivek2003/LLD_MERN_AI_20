import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { StatusTone } from '../../constants/statuses.js';

const PAYMENTS = [
  { id: 'PMT-1041', plate: 'KA-01-1234', amount: 80, method: 'CASH', status: 'PAID', paidAt: Date.now() - 1e6 },
  { id: 'PMT-1042', plate: 'MH-12-9921', amount: 120, method: 'UPI', status: 'PAID', paidAt: Date.now() - 6e5 },
  { id: 'PMT-1043', plate: 'TN-09-4422', amount: 60, method: 'CARD', status: 'PENDING', paidAt: Date.now() - 1e5 },
];

export function PaymentsPage() {
  const total = PAYMENTS.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    { key: 'id', header: 'Payment ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'plate', header: 'Vehicle', render: (r) => <span className="font-mono">{r.plate}</span> },
    { key: 'amount', header: 'Amount', render: (r) => formatCurrency(r.amount) },
    { key: 'method', header: 'Method' },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={StatusTone[r.status]}>{r.status}</Badge> },
    { key: 'paidAt', header: 'Time', render: (r) => formatDate(r.paidAt) },
  ];

  return (
    <PageContainer
      title="Today's Payments"
      subtitle="All transactions for the current day"
    >
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
        Preview only — payments are recorded by <code>POST /api/exit</code>. A list
        endpoint isn’t available yet, so this view shows sample rows.
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-500">Total Collected</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">{formatCurrency(total)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-500">Transactions</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">{PAYMENTS.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-500">Pending</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">
            {PAYMENTS.filter((p) => p.status === 'PENDING').length}
          </p>
        </Card>
      </div>
      <Table columns={columns} data={PAYMENTS} rowKey="id" />
    </PageContainer>
  );
}
