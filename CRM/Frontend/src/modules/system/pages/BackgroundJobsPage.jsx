import { useState } from 'react';
import { BriefcaseBusiness, RefreshCw } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { JOB_STATUS } from '../../../shared/enums/job-status.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import JobList from '../components/JobList.jsx';

/** System → Background Jobs. Queue depth plus a per-job re-run action. */
export function BackgroundJobsPage() {
  const toast = useToast();
  const jobs = useAsync(() => systemApi.jobs(), [], { initialData: [] });
  const [busyId, setBusyId] = useState(null);

  const list = Array.isArray(jobs.data) ? jobs.data : [];
  const count = (status) => list.filter((job) => job.status === status).length;

  const run = async (job) => {
    setBusyId(job.jobId);
    try {
      await systemApi.runJob(job.jobId);
      await jobs.reload();
      toast.success('Job queued', job.name);
    } catch (err) {
      toast.fromError(err, 'Could not run job');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Background Jobs"
        subtitle="Monitor and re-run background job execution"
        icon={BriefcaseBusiness}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={jobs.reload}>
            Refresh
          </Button>
        }
      />

      <KpiGrid columns={4} className="mb-5">
        <KpiTile label="Running" value={count(JOB_STATUS.RUNNING)} icon={BriefcaseBusiness} tone="sky" loading={jobs.loading} />
        <KpiTile label="Queued" value={count(JOB_STATUS.QUEUED)} icon={BriefcaseBusiness} tone="amber" loading={jobs.loading} />
        <KpiTile label="Completed" value={count(JOB_STATUS.COMPLETED)} icon={BriefcaseBusiness} tone="emerald" loading={jobs.loading} />
        <KpiTile label="Failed" value={count(JOB_STATUS.FAILED)} icon={BriefcaseBusiness} tone="rose" loading={jobs.loading} />
      </KpiGrid>

      <Card>
        <CardHeader title="All Jobs" subtitle={`${list.length} jobs known to the scheduler`} icon={BriefcaseBusiness} />
        <JobList
          jobs={list}
          loading={jobs.loading}
          error={jobs.error}
          onRetry={jobs.reload}
          onRun={run}
          busyId={busyId}
        />
      </Card>
    </>
  );
}

export default BackgroundJobsPage;
