import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import BoardPage from "../pages/BoardPage";
import DragPlay5x5 from "../pages/DragPlay";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
      {/* <Route path="/board/:boardId" element={<DragPlay5x5 />} /> */}
    </Routes>
  );
}