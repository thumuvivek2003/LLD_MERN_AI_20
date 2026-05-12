export const EmptyState = ({ icon = '📭', title = 'Nothing here', subtitle, action }) => (
  <div className="text-center py-12">
    <div className="text-5xl mb-3">{icon}</div>
    <h3 className="font-semibold text-lg">{title}</h3>
    {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
