import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";

const TransferPage = () => {
  const [wallets, setWallets] = useState([]);
  const [formData, setFormData] = useState({
    fromWalletId: "", // Ini akan menjadi nomor wallet, bukan ID
    toWalletNumber: "",
    amount: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchWallets = useCallback(async () => {
    try {
      const response = await api.get("/wallets/me");
      const userWallets = response.data.data;
      setWallets(userWallets);

      // Cek apakah ada parameter 'from' di URL
      const fromWalletNumber = searchParams.get("from");
      if (
        fromWalletNumber &&
        userWallets.some((w) => w.number === fromWalletNumber)
      ) {
        setFormData((prev) => ({ ...prev, fromWalletId: fromWalletNumber }));
      } else if (userWallets.length > 0) {
        // Set default ke wallet pertama jika tidak ada parameter
        setFormData((prev) => ({
          ...prev,
          fromWalletId: userWallets[0].number,
        }));
      }
    } catch (error) {
      toast.error("Gagal memuat daftar kantong.");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fromWalletId ||
      !formData.toWalletNumber ||
      !formData.amount
    ) {
      toast.error("Semua kolom wajib diisi.");
      return;
    }
    if (formData.fromWalletId === formData.toWalletNumber) {
      toast.error("Tidak bisa mengirim uang ke kantong yang sama.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/wallets/transfer", {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success("Uang berhasil dikirim!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim uang.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kirim Uang</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="toWalletNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nomor Wallet Penerima
          </label>
          <input
            type="text"
            name="toWalletNumber"
            id="toWalletNumber"
            value={formData.toWalletNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Nomor Wallet Penerima (pastikan benar)"
          />
        </div>
        <div>
          <label
            htmlFor="fromWalletId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pilih Kantong*
          </label>
          <select
            name="fromWalletId"
            id="fromWalletId"
            value={formData.fromWalletId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            {wallets.map((wallet) => (
              <option key={wallet.wallet_id} value={wallet.number}>
                {wallet.name} (Rp. {wallet.balance.toLocaleString("id-ID")})
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
        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Catatan (Opsional)
          </label>
          <input
            type="text"
            name="note"
            id="note"
            value={formData.note}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Tulis catatan untuk penerima"
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
            {isLoading ? "Mengirim..." : "Kirim Uang"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferPage;
