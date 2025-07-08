import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";

const WalletDetailPage = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWalletDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/wallets/me");
      const foundWallet = response.data.data.find(
        (w) => w.wallet_id === parseInt(walletId)
      );
      if (foundWallet) {
        setWallet(foundWallet);
      } else {
        toast.error("Kantong tidak ditemukan.");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Gagal memuat detail kantong.");
      navigate("/home");
    } finally {
      setIsLoading(false);
    }
  }, [walletId, navigate]);

  useEffect(() => {
    fetchWalletDetails();
  }, [fetchWalletDetails]);

  const handleDelete = async () => {
    if (wallet.name === "Main") {
      toast.error("Kantong utama tidak bisa dihapus.");
      return;
    }
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus kantong "${wallet.name}"?`
      )
    ) {
      try {
        await api.delete(`/wallets/${walletId}`);
        toast.success("Kantong berhasil dihapus.");
        navigate("/home");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Gagal menghapus kantong."
        );
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Memuat detail kantong...</div>;
  }

  if (!wallet) {
    return null;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Detail [{wallet.name}]
        </h2>
        <div className="flex items-center space-x-4">
          <Link
            to="/topup"
            className="flex flex-col items-center text-gray-600 hover:text-green-600 p-2 rounded-lg border border-gray-300"
          >
            <span className="text-xl">⬆️</span>
            <span className="text-xs font-semibold mt-1">Top Up</span>
          </Link>
          <Link
            to={`/transfer`}
            className="flex flex-col items-center text-gray-600 hover:text-green-600 p-2 rounded-lg border border-gray-300"
          >
            <span className="text-xl">💸</span>
            <span className="text-xs font-semibold mt-1">Kirim</span>
          </Link>
          <Link
            to={`/move?from=${wallet.number}`}
            className="flex flex-col items-center text-gray-600 hover:text-green-600 p-2 rounded-lg border border-gray-300"
          >
            <span className="text-xl">🔄</span>
            <span className="text-xs font-semibold mt-1">Pindah</span>
          </Link>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <p className="text-sm text-gray-500">Nama Kantong</p>
          <p className="font-semibold text-gray-800">{wallet.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Deskripsi</p>
          <p className="font-semibold text-gray-800">{wallet.desc}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Uang</p>
          <p className="font-semibold text-gray-800 text-xl">
            Rp. {wallet.balance.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end space-x-4">
        <button
          onClick={handleDelete}
          className="text-red-600 font-medium hover:text-red-800"
        >
          Hapus Kantong
        </button>
        <Link
          to={`/wallets/${walletId}/edit`}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Edit Kantong
        </Link>
      </div>
    </div>
  );
};

export default WalletDetailPage;
