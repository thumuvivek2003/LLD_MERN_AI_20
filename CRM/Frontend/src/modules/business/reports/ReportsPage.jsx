import { useEffect, useMemo, useState } from 'react';
import { BarChart3, PieChart, Table2 } from 'lucide-react';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import useObject from '../../../core/hooks/useObject.js';
import usePermission from '../../../core/hooks/usePermission.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Select from '../../../core/components/ui/Select.jsx';
import DataTable from '../../../core/components/table/DataTable.jsx';
import { BarChart, DonutChart, colorAt } from '../../../core/components/charts/index.js';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatCompact, formatNumber, formatPercent } from '../../../core/utils/formatters.js';
import useReport, { groupableFields, measurableFields } from './useReport.js';

/**
 * Business screen 14 — Reports.
 * Report definitions are derived from metadata (group by any picklist/text/lookup field,
 * measure by count or a numeric field) and computed from real records.
 */
export function ReportsPage() {
  const { objects } = useMetadata();
  const [objectId, setObjectId] = useState('');
  const [groupFieldId, setGroupFieldId] = useState('');
  const [measureFieldId, setMeasureFieldId] = useState('');

  useEffect(() => {
    if (!objectId && objects.length) setObjectId(objects[0].objectId);
  }, [objects, objectId]);

  const { object, fields } = useObject(objectId);
  const permission = usePermission(objectId);
  const visible = useMemo(() => permission.visibleFields(fields), [fields, permission]);

  const groups = useMemo(() => groupableFields(visible), [visible]);
  const measures = useMemo(() => measurableFields(visible), [visible]);

  useEffect(() => {
    setGroupFieldId(groups[0]?.fieldId ?? '');
    setMeasureFieldId('');
  }, [groups]);

  const groupField = groups.find((field) => field.fieldId === groupFieldId);
  const measureField = measures.find((field) => field.fieldId === measureFieldId);

  const report = useReport({ objectId, groupField, measureField, enabled: Boolean(groupField) });
  const data = report.data?.data || [];
  const total = report.data?.total || 0;

  const chartData = data.slice(0, 8).map((item, index) => ({ ...item, color: colorAt(index) }));

  const columns = [
    { key: 'label', header: groupField?.label ?? 'Group', className: 'font-semibold text-slate-800' },
    {
      key: 'value',
      header: measureField ? `Sum of ${measureField.label}` : 'Records',
      align: 'right',
      render: (row) => formatNumber(row.value),
    },
    {
      key: 'share',
      header: 'Share',
      align: 'right',
      render: (row) => formatPercent(total ? (row.value / total) * 100 : 0),
    },
  ];

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Group your records and see the numbers"
        icon={BarChart3}
      />

      <Card className="mb-5">
        <div className="grid gap-4 p-4 sm:grid-cols-3">
          <div>
            <label className="mf-label">Object</label>
            <Select
              value={objectId}
              onChange={(event) => setObjectId(event.target.value)}
              options={objects.map((item) => ({
                value: item.objectId,
                label: item.pluralLabel || item.label,
              }))}
            />
          </div>
          <div>
            <label className="mf-label">Group by</label>
            <Select
              value={groupFieldId}
              placeholder={groups.length ? 'Select field' : 'No groupable fields'}
              disabled={!groups.length}
              onChange={(event) => setGroupFieldId(event.target.value)}
              options={groups.map((field) => ({ value: field.fieldId, label: field.label }))}
            />
          </div>
          <div>
            <label className="mf-label">Measure</label>
            <Select
              value={measureFieldId}
              placeholder="Count of records"
              onChange={(event) => setMeasureFieldId(event.target.value)}
              options={measures.map((field) => ({
                value: field.fieldId,
                label: `Sum of ${field.label}`,
              }))}
            />
          </div>
        </div>
      </Card>

      {!groupField ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="Nothing to report on yet"
            description={`${object?.label ?? 'This object'} has no picklist, text or lookup field to group by.`}
          />
        </Card>
      ) : report.error ? (
        <Card>
          <ErrorState error={report.error} onRetry={report.reload} />
        </Card>
      ) : report.loading ? (
        <Card className="p-6">
          <SkeletonText lines={8} />
        </Card>
      ) : !data.length ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="No records to aggregate"
            description="Create some records first, then come back."
          />
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader
              title={`${measureField ? `${measureField.label} by` : 'Records by'} ${groupField.label}`}
              subtitle={`${formatCompact(report.data.sampled)} records analysed${
                report.data.truncated ? ' (sampled)' : ''
              }`}
              icon={BarChart3}
            />
            <div className="p-5">
              <BarChart data={chartData} layout="horizontal" height={Math.max(220, chartData.length * 38)} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Distribution" subtitle="Top groups by share" icon={PieChart} />
            <div className="p-5">
              <DonutChart
                data={chartData}
                height={210}
                centerValue={formatCompact(total)}
                centerLabel={measureField ? measureField.label : 'records'}
              />
              <ul className="mt-4 space-y-1.5">
                {chartData.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                    <span className="min-w-0 flex-1 truncate text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{formatNumber(item.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="xl:col-span-3">
            <CardHeader title="Breakdown" subtitle="Every group, largest first" icon={Table2} />
            <DataTable columns={columns} rows={data} rowKey={(row) => row.label} dense />
          </Card>
        </div>
      )}
    </>
  );
}

export default ReportsPage;
