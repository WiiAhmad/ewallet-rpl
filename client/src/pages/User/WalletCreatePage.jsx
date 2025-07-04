import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import WalletForm from "../../components/user/WalletForm";

const WalletCreatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/wallets", formData);
      toast.success("Kantong berhasil dibuat!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat kantong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletForm
      title="Tambah Kantong"
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default WalletCreatePage;
