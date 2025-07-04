// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import HomePage from "../pages/User/HomePage";
import AdminDashboardPage from "../pages/Admin/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import useAuth from "../hooks/useAuth";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Redirect utama */}
      <Route
        path="/"
        element={
          user ? (
            user.role === "User" ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Rute Terproteksi untuk User */}
      <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
        <Route path="/home" element={<HomePage />} />
      </Route>

      {/* Rute Terproteksi untuk Admin & Owner */}
      <Route element={<ProtectedRoute allowedRoles={["Admin", "Owner"]} />}>
        <Route path="/dashboard" element={<AdminDashboardPage />} />
      </Route>

      {/* Rute Lainnya */}
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
