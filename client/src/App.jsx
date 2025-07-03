import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Import Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import CreateKantong from "./pages/Kantong/CreateKantong";
import KirimUang from "./pages/Transaksi/KirimUang";
// ... import halaman lainnya

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
            <Route path="/" element={<Home />} />
            <Route path="/create-kantong" element={<CreateKantong />} />
            <Route path="/kirim-uang" element={<KirimUang />} />
            {/* ... Tambahkan route privat lainnya di sini */}
          </Route>

          {/* Admin & Owner Routes (Contoh) */}
          {/* <Route element={<ProtectedRoute allowedRoles={['Admin', 'Owner']} />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
           </Route> 
           */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
