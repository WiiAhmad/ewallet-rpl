import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";

const TopUpPage = () => {
  const [wallets, setWallets] = useState([]);
  const [formData, setFormData] = useState({
    wallet_number: "",
    amount: "",
    payment_method: "Bank Transfer", // Default value
    reference_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWallets = useCallback(async () => {
    try {
      const response = await api.get("/wallets/me");
      setWallets(response.data.data);
      // Set default wallet if available
      if (response.data.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          wallet_number: response.data.data[0].number,
        }));
      }
    } catch (error) {
      toast.error("Gagal memuat daftar kantong.");
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wallet_number || !formData.amount || !formData.reference_id) {
      toast.error("Semua kolom wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      // Backend endpoint: /wallets/:wallet_number/topup
      await api.post(`/wallets/${formData.wallet_number}/topup`, {
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        reference_id: formData.reference_id,
      });
      toast.success("Permintaan top up berhasil dikirim dan sedang diproses.");
      navigate("/home");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal mengirim permintaan top up."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Up</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="wallet_number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pilih Kantong*
          </label>
          <select
            name="wallet_number"
            id="wallet_number"
            value={formData.wallet_number}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            {wallets.map((wallet) => (
              <option key={wallet.wallet_id} value={wallet.number}>
                {wallet.name} ({wallet.number}) - Saldo: Rp.{" "}
                {wallet.balance.toLocaleString("id-ID")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nominal*
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Nominal top up"
          />
          {/* Quick amount buttons */}
          <p className="text-xs text-gray-500 mt-1">
            Atau pilih nominal cepat:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {[50000, 100000, 250000, 500000].map((amt) => (
              <button
                type="button"
                key={amt}
                className={`px-3 py-1 rounded-md border border-green-500 text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                  formData.amount == amt ? "bg-green-200 font-bold" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, amount: amt }))
                }
              >
                Rp {amt.toLocaleString("id-ID")}
              </button>
            ))}
          </div>
        </div>
        
        <div
          className="flex items-center space-x-4 mt-4"
        >
          <label className="text-sm font-medium text-gray-700">
            Metode Pembayaran
          </label>
          <select
            name="payment_method"
            id="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="Bank Transfer">Transfer Bank</option>
            <option value="E-Wallet">E-Wallet</option>
            <option value="Cash">Tunai</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="reference_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bukti Transaksi*
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Kirim id transaksi sesuai nominal top up ke Rek Bank BDI 14522707
          </p>
          <input
            type="text"
            name="reference_id"
            id="reference_id"
            value={formData.reference_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="ID bukti transaksi sejumlah nominal"
          />
        </div>
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Link
            to="/home"
            className="text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {isLoading ? "Mengirim..." : "Top Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopUpPage;
