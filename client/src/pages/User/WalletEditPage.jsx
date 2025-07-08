import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import WalletForm from "../../components/user/WalletForm";

const WalletEditPage = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", desc: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchWallet = useCallback(async () => {
    try {
      // API untuk mengambil satu wallet tidak ada, jadi kita ambil semua dan filter
      const response = await api.get("/wallets/me");
      const wallet = response.data.data.find(
        (w) => w.wallet_id === parseInt(walletId)
      );
      if (wallet) {
        setFormData({ name: wallet.name, desc: wallet.desc });
      } else {
        toast.error("Kantong tidak ditemukan.");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Gagal mengambil data kantong.");
    } finally {
      setIsFetching(false);
    }
  }, [walletId, navigate]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/wallets/${walletId}`, formData);
      toast.success("Kantong berhasil diperbarui!");
      navigate(`/wallets/${walletId}`); // Kembali ke halaman detail
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui kantong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <WalletForm
      title="Edit Kantong"
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default WalletEditPage;
