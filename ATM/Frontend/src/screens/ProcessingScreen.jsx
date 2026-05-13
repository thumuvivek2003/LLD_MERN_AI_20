import { Loader2 } from 'lucide-react';

export default function ProcessingScreen() {
  return (
    <div className="flex flex-col items-center text-center gap-6 animate-fade-in">
      <Loader2 className="animate-spin text-atmaccent" size={42} />
      <h2 className="text-lg font-semibold text-white">Please wait</h2>
      <p className="text-sm text-slate-400">We are processing your request...</p>
    </div>
  );
}
