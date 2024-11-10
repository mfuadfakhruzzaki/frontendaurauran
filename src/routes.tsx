import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Project from "./pages/Project";
import Activity from "./pages/Activity";
import ProtectedRoute from "./components/ProtectedRoute"; // pastikan path sesuai dengan lokasi file

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/projects"
          element={<ProtectedRoute element={<Project />} />}
        />
        <Route
          path="/activities"
          element={<ProtectedRoute element={<Activity />} />}
        />

        {/* Rute yang tidak memerlukan autentikasi */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
