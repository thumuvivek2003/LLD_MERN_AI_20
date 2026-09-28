import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, ChevronUp, GripVertical, RotateCcw } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useFields from '../../../core/hooks/useFields.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { fieldTypeIcon, fieldTypeLabel } from '../../../core/fields/registry.js';
import cx from '../../../core/utils/cx.js';

const move = (list, from, to) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** Admin screen 10 — Reorder fields by drag & drop (with keyboard/button fallbacks). */
export function FieldReorderPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { object } = useObject(oid);
  const { fields, loading, error, reload, reorder } = useFields(oid);

  const [order, setOrder] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setOrder(fields), [fields]);

  const dirty = order.map((f) => f.fieldId).join() !== fields.map((f) => f.fieldId).join();

  const save = async () => {
    setSaving(true);
    try {
      await reorder(order.map((field) => field.fieldId));
      toast.success('Field order saved');
      navigate(`/admin/objects/${oid}?tab=fields`);
    } catch (err) {
      toast.fromError(err, 'Could not save field order');
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title={`Reorder Fields: ${object?.label ?? '…'}`}
        subtitle="Drag and drop to reorder fields — this is the order every form and list uses"
        icon={ArrowUpDown}
        back={`/admin/objects/${oid}?tab=fields`}
        breadcrumbs={[
          { label: 'Objects', to: '/admin/objects' },
          { label: object?.label ?? oid, to: `/admin/objects/${oid}` },
          { label: 'Reorder fields' },
        ]}
      />

      <Card>
        <div className="p-5">
          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : loading && !order.length ? (
            <SkeletonText lines={6} />
          ) : !order.length ? (
            <EmptyState title="No fields to reorder" description="Add fields to this object first." />
          ) : (
            <ul className="space-y-1.5">
              {order.map((field, index) => {
                const Icon = fieldTypeIcon(field.type);
                return (
                  <li
                    key={field.fieldId}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null) setOrder(move(order, dragIndex, index));
                      setDragIndex(null);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                    className={cx(
                      'flex cursor-grab items-center gap-3 rounded-lg border px-3.5 py-2.5 transition active:cursor-grabbing',
                      dragIndex === index
                        ? 'border-accent bg-accent-soft'
                        : 'border-slate-200 bg-white hover:border-slate-300',
                    )}
                  >
                    <GripVertical size={15} className="shrink-0 text-slate-300" />
                    <span className="w-6 shrink-0 text-center text-[11px] font-bold text-slate-400">
                      {index + 1}
                    </span>
                    <Icon size={15} className="shrink-0 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                      {field.label}
                    </span>
                    <span className="hidden text-[11px] text-slate-400 sm:block">
                      {fieldTypeLabel(field.type)}
                    </span>
                    <span className="flex shrink-0 gap-0.5">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={index === 0}
                        onClick={() => setOrder(move(order, index, index - 1))}
                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={index === order.length - 1}
                        onClick={() => setOrder(move(order, index, index + 1))}
                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-4">
          <Button variant="secondary" icon={RotateCcw} onClick={() => setOrder(fields)} disabled={!dirty}>
            Reset
          </Button>
          <Button onClick={save} loading={saving} disabled={!dirty}>
            Save Order
          </Button>
        </div>
      </Card>
    </>
  );
}

export default FieldReorderPage;
