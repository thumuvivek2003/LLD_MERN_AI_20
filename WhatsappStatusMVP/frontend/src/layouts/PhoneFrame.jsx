// layouts/PhoneFrame.jsx — centers the app in a premium phone frame on desktop,
// and goes edge-to-edge on small screens. Purely presentational.
export function PhoneFrame({ children }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[2.2rem] overflow-hidden relative bg-wa-ink sm:shadow-phone sm:ring-1 sm:ring-white/10">
        {/* subtle notch on desktop */}
        <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 h-5 w-28 bg-black rounded-full z-50 pointer-events-none" />
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
