export function LoginCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-wa-light p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wa-primary text-xl text-white">
            {'\u{1F4AC}'}
          </div>
          <div>
            <div className="text-lg font-semibold text-wa-dark">Chat MVP</div>
            <div className="text-xs text-wa-muted">
              LLD-focused real-time chat
            </div>
          </div>
        </div>
        <h1 className="mb-1 text-xl font-semibold text-wa-dark">{title}</h1>
        {subtitle ? (
          <p className="mb-6 text-sm text-wa-muted">{subtitle}</p>
        ) : (
          <div className="mb-6" />
        )}
        {children}
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
