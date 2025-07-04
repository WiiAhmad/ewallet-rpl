import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import HomePage from "../pages/User/HomePage";
import AdminDashboardPage from "../pages/Admin/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import useAuth from "../hooks/useAuth";

// Import Halaman dan Layout Baru
import MainLayout from "../layouts/MainLayout";
import WalletDetailPage from "../pages/User/WalletDetailPage";
import WalletCreatePage from "../pages/User/WalletCreatePage";
import WalletEditPage from "../pages/User/WalletEditPage";
import TopUpPage from "../pages/User/TopUpPage"; // <-- Import Halaman Top Up

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

      {/* Rute Terproteksi untuk User dengan Layout Utama */}
      <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/wallets/new" element={<WalletCreatePage />} />
          <Route path="/wallets/:walletId" element={<WalletDetailPage />} />
          <Route path="/wallets/:walletId/edit" element={<WalletEditPage />} />
          <Route path="/topup" element={<TopUpPage />} />{" "}
          {/* <-- Tambahkan Rute Top Up */}
          {/* Tambahkan rute lain untuk user di sini, misal: /history, /support */}
        </Route>
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
