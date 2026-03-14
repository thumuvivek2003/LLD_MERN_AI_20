import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/main.css'

import Navbar from "./components/Navbar";
import NotesPage from "./pages/NotesPage";
import EditNotePage from "./pages/EditNotePage";

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<NotesPage />} />

        <Route path="/edit/:id" element={<EditNotePage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;