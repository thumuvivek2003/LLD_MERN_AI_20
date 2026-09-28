import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import usePermission from '../../../core/hooks/usePermission.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { downloadFile } from '../../../core/utils/csv.js';
import { defaultColumnIds } from '../../../shared/mapper/record.mapper.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { Toggle } from '../../../core/components/ui/Toggle.jsx';
import ColumnChooser from '../../../core/components/table/ColumnChooser.jsx';

const ID_PAGE_SIZE = 200; // CONTRACT §1 — `limit` is capped at 200
const MAX_ID_PAGES = 10;

/** Business screen 11 — export records as CSV or JSON with a column selection. */
export function ExportRecordsPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);

  const [format, setFormat] = useState('csv');
  const [columnIds, setColumnIds] = useState([]);
  const [allColumns, setAllColumns] = useState(true);
  const [activeOnly, setActiveOnly] = useState(true);
  const [busy, setBusy] = useState(false);

  const visible = useMemo(() => permission.visibleFields(fields), [fields, permission]);

  useEffect(() => {
    if (visible.length && !columnIds.length) setColumnIds(defaultColumnIds(visible, 5));
  }, [visible, columnIds.length]);

  /**
   * "Active only" is expressed with the contract's `recordIds` param — the export
   * endpoint takes no status filter, so the ids are collected from the record list first.
   */
  const collectActiveIds = async () => {
    const ids = [];
    for (let page = 1; page <= MAX_ID_PAGES; page += 1) {
      // eslint-disable-next-line no-await-in-loop
      const batch = await recordsApi.list(oid, { page, limit: ID_PAGE_SIZE, status: 'ACTIVE' });
      const rows = Array.isArray(batch) ? batch : batch?.records || [];
      ids.push(...rows.map((record) => record.recordId));
      const totalPages = rows.meta?.totalPages ?? batch?.meta?.totalPages ?? 1;
      if (page >= totalPages) break;
    }
    return ids;
  };

  const run = async () => {
    setBusy(true);
    try {
      const params = { format };
      if (!allColumns) params.fieldIds = columnIds.join(',');
      if (activeOnly) {
        const ids = await collectActiveIds();
        if (ids.length) params.recordIds = ids.join(',');
      }
      const payload = await recordsApi.export(oid, params);
      const extension = format === 'json' ? 'json' : 'csv';
      const mime = format === 'json' ? 'application/json' : 'text/csv;charset=utf-8';
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
      downloadFile(`${object?.apiName ?? 'records'}-export.${extension}`, body, mime);
      toast.success('Export ready', 'Your file has been downloaded');
    } catch (err) {
      toast.fromError(err, 'Export failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title={`Export ${object?.pluralLabel ?? 'Records'}`}
        subtitle="Export records to a file"
        icon={Download}
        back={`/business/objects/${oid}/records`}
        breadcrumbs={[
          { label: 'My Objects', to: '/business/objects' },
          { label: object?.label ?? oid, to: `/business/objects/${oid}/records` },
          { label: 'Export' },
        ]}
      />

      <Card className="max-w-2xl">
        <div className="space-y-5 p-5">
          <div>
            <label className="mf-label" htmlFor="exportrecordspage-format">Format</label>
            <Select
              id="exportrecordspage-format"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              options={[
                { value: 'csv', label: 'CSV (.csv)' },
                { value: 'json', label: 'JSON (.json)' },
              ]}
            />
          </div>

          <div>
            <label className="mf-label">Columns</label>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                className="flex-1"
                value={allColumns ? 'all' : 'selected'}
                onChange={(event) => setAllColumns(event.target.value === 'all')}
                options={[
                  { value: 'all', label: 'All Columns' },
                  { value: 'selected', label: `Selected columns (${columnIds.length})` },
                ]}
              />
              {!allColumns && (
                <ColumnChooser
                  fields={visible}
                  selected={columnIds}
                  onChange={setColumnIds}
                  onReset={() => setColumnIds(defaultColumnIds(visible, 5))}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3.5 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Export active records only</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Turn off to include archived records in the file.
              </p>
            </div>
            <Toggle checked={activeOnly} onChange={setActiveOnly} />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
          <Button variant="secondary" onClick={() => navigate(`/business/objects/${oid}/records`)}>
            Cancel
          </Button>
          <Button icon={Download} loading={busy} onClick={run}>
            Export
          </Button>
        </div>
      </Card>
    </>
  );
}

export default ExportRecordsPage;
