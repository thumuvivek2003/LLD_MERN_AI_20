// Placeholder layout. The MVP has no auth — we keep it for tree compliance
// and so a future signup screen can drop in here.
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-card">
        {children}
      </div>
    </div>
  );
}
