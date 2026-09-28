import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, FileSpreadsheet, Upload, UploadCloud } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import usePermission from '../../../core/hooks/usePermission.js';
import recordsApi from '../../../core/api/records.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { downloadFile, parseCsv, readFileAsText, toCsv } from '../../../core/utils/csv.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import BulkResultSummary from '../../admin/components/BulkResultSummary.jsx';
import cx from '../../../core/utils/cx.js';

/** Business screen 10 — CSV import with column → field mapping and a dry run. */
export function ImportRecordsPage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const permission = usePermission(oid);
  const { object, fields } = useObject(oid);
  const inputRef = useRef(null);

  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState({ headers: [], rows: [] });
  const [mapping, setMapping] = useState({});
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const importable = useMemo(
    () => permission.visibleFields(fields).filter((field) => permission.isFieldEditable(field)),
    [fields, permission],
  );

  const autoMap = (headers) =>
    headers.reduce((acc, header) => {
      const match = importable.find(
        (field) =>
          field.label.toLowerCase() === header.toLowerCase() ||
          field.apiName.toLowerCase() === header.toLowerCase(),
      );
      if (match) acc[header] = match.fieldId;
      return acc;
    }, {});

  const loadFile = async (file) => {
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const data = parseCsv(text);
      setFileName(file.name);
      setParsed(data);
      setMapping(autoMap(data.headers));
      setPreview(null);
      setResult(null);
    } catch (err) {
      toast.error('Could not read file', err.message);
    }
  };

  const downloadSample = () => {
    const headers = importable.map((field) => field.label);
    downloadFile(`${object?.apiName ?? 'records'}-sample.csv`, toCsv(headers, [headers.map(() => '')]));
  };

  const run = async (dryRun) => {
    setBusy(true);
    try {
      const outcome = await recordsApi.import(oid, { rows: parsed.rows, mapping, dryRun });
      if (dryRun) {
        setPreview(outcome);
        toast.info('Dry run complete', `${outcome?.processed ?? parsed.rows.length} rows checked`);
      } else {
        setResult(outcome);
        toast.success('Import complete', `${outcome?.succeeded ?? 0} records created`);
      }
    } catch (err) {
      toast.fromError(err, dryRun ? 'Validation failed' : 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  const mappedCount = Object.values(mapping).filter(Boolean).length;

  return (
    <>
      <PageHeader
        title={`Import ${object?.pluralLabel ?? 'Records'}`}
        subtitle="Upload a CSV file to import records"
        icon={Upload}
        back={`/business/objects/${oid}/records`}
        breadcrumbs={[
          { label: 'My Objects', to: '/business/objects' },
          { label: object?.label ?? oid, to: `/business/objects/${oid}/records` },
          { label: 'Import' },
        ]}
      />

      {result ? (
        <Card className="p-5">
          <BulkResultSummary
            result={result}
            onDone={() => navigate(`/business/objects/${oid}/records`)}
            doneLabel="Back to records"
          />
        </Card>
      ) : (
        <div className="space-y-5">
          <Card className="p-5">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                loadFile(event.dataTransfer.files?.[0]);
              }}
              className={cx(
                'flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition',
                dragging ? 'border-accent bg-accent-soft' : 'border-slate-200 bg-slate-50/60',
              )}
            >
              <UploadCloud size={30} className="mb-3 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">
                Drag & drop your file here or
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => loadFile(event.target.files?.[0])}
              />
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => inputRef.current?.click()}
              >
                Choose File
              </Button>
              <p className="mt-3 text-[11px] text-slate-400">Supported format: CSV</p>
              {fileName && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <FileSpreadsheet size={13} /> {fileName} · {parsed.rows.length} rows
                </p>
              )}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={downloadSample}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <Download size={12} /> Download Sample File
              </button>
            </div>
          </Card>

          {parsed.headers.length > 0 && (
            <Card>
              <CardHeader
                title="Map columns to fields"
                subtitle={`${mappedCount} of ${parsed.headers.length} CSV columns mapped`}
                icon={FileSpreadsheet}
              />
              <ul className="divide-y divide-slate-100 px-5">
                {parsed.headers.map((header) => (
                  <li key={header} className="flex items-center justify-between gap-4 py-3">
                    <span className="min-w-0 truncate text-sm font-medium text-slate-700">{header}</span>
                    <Select
                      size="sm"
                      className="w-56"
                      value={mapping[header] || ''}
                      placeholder="Skip this column"
                      onChange={(event) =>
                        setMapping((current) => ({ ...current, [header]: event.target.value }))
                      }
                      options={importable.map((field) => ({
                        value: field.fieldId,
                        label: field.label,
                      }))}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
                <Button variant="secondary" onClick={() => run(true)} loading={busy}>
                  Validate (dry run)
                </Button>
                <Button
                  icon={Upload}
                  loading={busy}
                  disabled={!mappedCount || !permission.canCreate}
                  onClick={() => run(false)}
                >
                  Import {parsed.rows.length} rows
                </Button>
              </div>
            </Card>
          )}

          {preview && (
            <Card>
              <CardHeader
                title="Dry run result"
                subtitle={`${preview.succeeded ?? 0} would succeed · ${preview.failed ?? 0} would fail`}
                icon={FileSpreadsheet}
              />
              {preview.preview?.length ? (
                <DataTable
                  columns={Object.keys(preview.preview[0] || {}).map((key) => ({
                    key,
                    header: key,
                    render: (row) => String(row[key] ?? ''),
                  }))}
                  rows={preview.preview}
                  rowKey={(row, index) => index}
                  dense
                  emptyTitle="Nothing to preview"
                />
              ) : (
                <div className="p-5">
                  <BulkResultSummary result={preview} />
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </>
  );
}

export default ImportRecordsPage;
