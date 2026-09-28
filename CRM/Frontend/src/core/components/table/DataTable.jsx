import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import cx from '../../utils/cx.js';
import { SkeletonTable } from '../ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../ui/EmptyState.jsx';
import Menu from '../ui/Menu.jsx';

/**
 * One table for the whole app.
 *
 * `columns` = `[{ key, header, width, align, sortable, className, render(row) }]`
 * `rowActions(row)` → Menu items array, rendered in a sticky right-hand cell.
 * Selection is opt-in via `selectable` + `selectedIds` + `onSelectionChange`.
 *
 * Horizontal overflow scrolls inside the table, never the page.
 */
export function DataTable({
  columns = [],
  rows = [],
  rowKey = (row, index) => row.id ?? index,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  emptyIcon,
  emptyAction,
  sort,
  onSortChange,
  onRowClick,
  rowActions,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  dense = false,
  footer,
  className,
}) {
  if (loading) return <SkeletonTable rows={6} cols={Math.min(columns.length || 5, 6)} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!rows.length) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  const allSelected = selectable && rows.length > 0 && rows.every((row) => selectedIds.includes(rowKey(row)));

  const toggleAll = () =>
    onSelectionChange?.(allSelected ? [] : rows.map((row) => rowKey(row)));

  const toggleOne = (id) =>
    onSelectionChange?.(
      selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id],
    );

  const cellPad = dense ? 'px-4 py-2.5' : 'px-5 py-3.5';

  return (
    <div className={cx('mf-scroll-x', className)}>
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50/70">
            {selectable && (
              <th className={cx('w-10', cellPad)}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                  className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-accent focus:ring-accent/30"
                />
              </th>
            )}
            {columns.map((column) => (
              <HeaderCell
                key={column.key}
                column={column}
                sort={sort}
                onSortChange={onSortChange}
                className={cellPad}
              />
            ))}
            {rowActions && (
              <th className={cx('text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500', cellPad)}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const id = rowKey(row, index);
            const selected = selectable && selectedIds.includes(id);
            return (
              <tr
                key={id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cx(
                  'border-b border-slate-50 transition last:border-0',
                  selected ? 'bg-accent-soft/60' : 'hover:bg-slate-50/70',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {selectable && (
                  <td className={cellPad} onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleOne(id)}
                      aria-label="Select row"
                      className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-accent focus:ring-accent/30"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cx(
                      cellPad,
                      'align-middle text-slate-600',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      column.className,
                    )}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.render ? column.render(row, index) : row[column.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className={cx(cellPad, 'text-right')} onClick={(event) => event.stopPropagation()}>
                    <Menu items={rowActions(row)} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
}

function HeaderCell({ column, sort, onSortChange, className }) {
  const active = sort?.key === column.key;
  const Icon = !active ? ChevronsUpDown : sort.order === 'asc' ? ArrowUp : ArrowDown;

  if (!column.sortable || !onSortChange) {
    return (
      <th
        className={cx(
          'whitespace-nowrap text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500',
          column.align === 'right' && 'text-right',
          column.align === 'center' && 'text-center',
          className,
        )}
        style={column.width ? { width: column.width } : undefined}
      >
        {column.header}
      </th>
    );
  }

  return (
    <th
      className={cx('whitespace-nowrap text-left', className)}
      style={column.width ? { width: column.width } : undefined}
    >
      <button
        type="button"
        onClick={() => onSortChange({ key: column.key, order: active && sort.order === 'asc' ? 'desc' : 'asc' })}
        className={cx(
          'inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide transition',
          active ? 'text-accent' : 'text-slate-500 hover:text-slate-700',
        )}
      >
        {column.header}
        <Icon size={12} />
      </button>
    </th>
  );
}

export default DataTable;
