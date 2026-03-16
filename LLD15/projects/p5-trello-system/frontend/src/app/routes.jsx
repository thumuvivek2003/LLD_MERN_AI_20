import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import BoardPage from "../pages/BoardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
    </Routes>
  );
}