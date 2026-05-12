export const Loader = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center py-8 text-gray-500">
    <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mr-2"></div>
    {label}
  </div>
);
