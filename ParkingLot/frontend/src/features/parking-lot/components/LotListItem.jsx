import { Card } from '../../../components/ui/Card.jsx';
import { formatLotLabel } from '../utils/lotFormatters.js';

export const LotListItem = ({ lot, onClick }) => (
  <button type="button" onClick={onClick} className="block w-full text-left">
    <Card className="hover:border-brand-400">
      <div className="font-semibold text-slate-900">{lot.name}</div>
      <div className="text-xs text-slate-500">{formatLotLabel(lot)}</div>
    </Card>
  </button>
);
