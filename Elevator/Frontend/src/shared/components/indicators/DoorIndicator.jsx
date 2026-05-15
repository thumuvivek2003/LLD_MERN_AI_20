import clsx from 'clsx';

export default function DoorIndicator({ open = false }) {
  return (
    <div className="flex items-center gap-0.5 w-8 h-6 mx-auto">
      <div className={clsx('h-full bg-slate-300 transition-all duration-300', open ? 'w-1' : 'w-1/2')} />
      <div className={clsx('h-full bg-slate-300 transition-all duration-300', open ? 'w-1' : 'w-1/2')} />
    </div>
  );
}
