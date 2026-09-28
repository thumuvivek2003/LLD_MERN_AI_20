import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDownUp,
  Columns3,
  Download,
  Filter,
  Layers,
  LayoutGrid,
  List,
  Plus,
  Upload,
} from 'lucide-react';
import Button from '../../../../core/components/ui/Button.jsx';
import Select from '../../../../core/components/ui/Select.jsx';
import { SegmentedControl } from '../../../../core/components/ui/Tabs.jsx';
import ColumnChooser from '../../../../core/components/table/ColumnChooser.jsx';
import Menu from '../../../../core/components/ui/Menu.jsx';

const VIEW_MODES = [
  { value: 'list', label: 'List', icon: List },
  { value: 'grid', label: 'Grid', icon: LayoutGrid },
  { value: 'board', label: 'Board', icon: Columns3 },
];

/**
 * Toolbar above the business record list — saved view picker, filters, sort,
 * column chooser, layout toggle and the New Record action.
 */
export function RecordToolbar({
  objectId,
  views = [],
  activeViewId,
  onViewChange,
  onToggleFilters,
  filterCount = 0,
  sortFieldId,
  sortOrder,
  sortableFields = [],
  onSortChange,
  fields = [],
  columnIds,
  onColumnsChange,
  onColumnsReset,
  viewMode,
  onViewModeChange,
  canCreate,
  selectedCount = 0,
  onBulk,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Select
        className="w-48"
        value={activeViewId}
        placeholder="All Records"
        onChange={(event) => onViewChange(event.target.value)}
        options={views.map((view) => ({ value: view.viewId, label: view.name }))}
      />

      <Button variant="secondary" icon={Filter} onClick={onToggleFilters}>
        Filters
        {filterCount > 0 && (
          <span className="ml-0.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
            {filterCount}
          </span>
        )}
      </Button>

      <div className="flex items-center gap-1.5">
        <Select
          size="sm"
          className="w-40"
          value={sortFieldId}
          placeholder="Sort by"
          onChange={(event) => onSortChange(event.target.value, sortOrder)}
          options={sortableFields.map((field) => ({ value: field.fieldId, label: field.label }))}
        />
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowDownUp}
          onClick={() => onSortChange(sortFieldId, sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>

      <ColumnChooser
        fields={fields}
        selected={columnIds}
        onChange={onColumnsChange}
        onReset={onColumnsReset}
      />

      <SegmentedControl options={VIEW_MODES} value={viewMode} onChange={onViewModeChange} />

      <div className="ml-auto flex items-center gap-2">
        {selectedCount > 0 && (
          <Button variant="soft" icon={Layers} onClick={onBulk}>
            Bulk actions ({selectedCount})
          </Button>
        )}
        <Menu
          buttonLabel="More"
          items={[
            {
              id: 'import',
              label: 'Import records',
              icon: Upload,
              onSelect: () => navigate(`/business/objects/${objectId}/import`),
            },
            {
              id: 'export',
              label: 'Export records',
              icon: Download,
              onSelect: () => navigate(`/business/objects/${objectId}/export`),
            },
          ]}
          trigger={
            <Button variant="secondary" iconRight={ArrowDownUp}>
              More
            </Button>
          }
        />
        {canCreate && (
          <Button as={Link} to={`/business/objects/${objectId}/records/new`} icon={Plus}>
            New Record
          </Button>
        )}
      </div>
    </div>
  );
}

export default RecordToolbar;
