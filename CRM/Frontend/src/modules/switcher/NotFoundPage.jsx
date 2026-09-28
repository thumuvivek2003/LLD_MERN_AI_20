import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../../core/components/ui/Button.jsx';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="mf-card max-w-sm p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
          <Compass size={22} />
        </span>
        <h1 className="text-lg font-bold text-slate-900">Page not found</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          That route does not exist in MetaForce. Pick an actor and start again.
        </p>
        <Button as={Link} to="/" className="mt-5">
          Back to user switcher
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
