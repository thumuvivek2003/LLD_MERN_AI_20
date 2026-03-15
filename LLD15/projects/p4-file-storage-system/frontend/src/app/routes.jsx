import { Routes, Route } from "react-router-dom";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import UploadPage from "../pages/Upload/UploadPage";
import FilesPage from "../pages/Files/FilesPage";
import LoginPage from "../pages/Login/LoginPage";

function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/files" element={<FilesPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default RoutesConfig