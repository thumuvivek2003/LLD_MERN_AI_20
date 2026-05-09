export default function PageContainer({ title, children }) {
  return (
    <div className="page-container">
      {title && <h1 className="page-title">{title}</h1>}
      {children}
    </div>
  );
}
