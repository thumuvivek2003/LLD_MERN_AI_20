import { Link } from 'react-router-dom';
import {
  BarChart3,
  Bookmark,
  CircleHelp,
  Download,
  LayoutGrid,
  Plus,
  Search,
  Upload,
} from 'lucide-react';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card } from '../../../core/components/ui/Card.jsx';

const TOPICS = [
  {
    icon: LayoutGrid,
    title: 'Find your objects',
    body: 'My Objects lists everything your role can read. Star an object to pin it to Favorites.',
    to: '/business/objects',
  },
  {
    icon: Plus,
    title: 'Create a record',
    body: 'Open an object and press New Record. The form is generated from the object metadata, so required fields and validation come straight from the platform admin’s setup.',
    to: '/business/objects',
  },
  {
    icon: Search,
    title: 'Filter and search',
    body: 'Build filter rows (field → operator → value). Every query runs against the index layer, and the result header shows which index served it.',
    to: '/business/search',
  },
  {
    icon: Bookmark,
    title: 'Save a view',
    body: 'Press Save View on any filter set to reuse it later. Views keep their filters, sort order and columns.',
    to: '/business/views',
  },
  {
    icon: Upload,
    title: 'Import records',
    body: 'Upload a CSV, map each column to a field, and run a dry run before importing for real.',
  },
  {
    icon: Download,
    title: 'Export records',
    body: 'Export to CSV or JSON, choosing which columns are included.',
  },
  {
    icon: BarChart3,
    title: 'Run a report',
    body: 'Group records by any picklist, text or lookup field and measure by count or a numeric field.',
    to: '/business/reports',
  },
];

/** Business sidebar → Help. How the metadata-driven console works. */
export function HelpPage() {
  return (
    <>
      <PageHeader
        title="Help"
        subtitle="How to get things done in the MetaForce business console"
        icon={CircleHelp}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const body = (
            <Card className="h-full p-5">
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon size={17} />
              </span>
              <p className="text-sm font-bold text-slate-900">{topic.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{topic.body}</p>
            </Card>
          );
          return topic.to ? (
            <Link key={topic.title} to={topic.to} className="transition hover:-translate-y-0.5">
              {body}
            </Link>
          ) : (
            <div key={topic.title}>{body}</div>
          );
        })}
      </div>
    </>
  );
}

export default HelpPage;
