import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada role spesifik yang diizinkan dan role user tidak termasuk di dalamnya
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect ke halaman 'unauthorized' atau home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
