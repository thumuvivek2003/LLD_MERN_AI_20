export default function AnalyticsCard({ title, value }) {

  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "10px",
      margin: "10px"
    }}>

      <h3>{title}</h3>
      <p>{value}</p>

    </div>
  );
}