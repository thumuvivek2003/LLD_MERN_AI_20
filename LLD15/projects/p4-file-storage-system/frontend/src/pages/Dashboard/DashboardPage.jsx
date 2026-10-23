import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <div>
      <h1>File Storage Dashboard</h1>

      <Link to="/upload">Upload File</Link>
      <br />
      <Link to="/files">View Files</Link>
    </div>
  );
}

export default DashboardPage;