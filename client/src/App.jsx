import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Dashboard/Home";
import CreateKantong from "./pages/Kantong/CreateKantong";
import DetailKantong from "./pages/Kantong/DetailKantong";
import EditKantong from "./pages/Kantong/EditKantong";
import KirimUang from "./pages/Transaction/KirimUang";
import PindahUang from "./pages/Transaction/PindahUang";
import RiwayatTransaksi from "./pages/Transaction/RiwayatTransaksi";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/kantong/new" element={<CreateKantong />} />
        <Route path="/kantong/:id" element={<DetailKantong />} />
        <Route path="/kantong/:id/edit" element={<EditKantong />} />
        <Route path="/transfer/send" element={<KirimUang />} />
        <Route path="/transfer/move" element={<PindahUang />} />
        <Route path="/history" element={<RiwayatTransaksi />} />
      </Routes>
    </div>
  );
}

export default App;
