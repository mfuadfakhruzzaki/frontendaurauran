import React from "react";
import { Navigate } from "react-router-dom";

// Fungsi cek autentikasi (contoh)
const isAuthenticated = () => {
  // Cek autentikasi, misalnya, memeriksa token di local storage
  return Boolean(localStorage.getItem("authToken"));
};

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
