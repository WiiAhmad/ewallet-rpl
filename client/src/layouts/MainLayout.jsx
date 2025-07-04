import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import api from "../api/axiosConfig";

// Komponen ini akan menjadi pembungkus untuk halaman-halaman pengguna
const MainLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      toast.success("Logout successful!");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/home" className="text-2xl font-bold text-green-600">
            e-wal
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-green-600">
              Riwayat Trx
            </Link>
            <Link to="/support" className="text-gray-600 hover:text-green-600">
              Support
            </Link>
          </nav>
          <div className="flex items-center">
            <span className="font-semibold mr-4">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Konten Halaman akan dirender di sini */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>PT Ewall Tumbuh Abadi</p>
        <p>
          Berizin dan diawasi{" "}
          <span className="font-bold">Otoritas Jasa Keuangan</span>
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
